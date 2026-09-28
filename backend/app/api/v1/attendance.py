import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import require_roles, get_db
from app.models.user import UserRole, User
from app.models.event import Event
from app.models.registration import EventRegistration

router = APIRouter(prefix="/attendance", tags=["Attendance"])



class QRScanRequest(BaseModel):
    qr_payload: Optional[str] = Field(None, description="Unique QR token or payload string scanned from participant pass", example="EVENTIQ:REG-1:a1b2c3d4e5f6")
    qr_token: Optional[str] = Field(None, description="Alias for qr_payload", example="EVENTIQ:REG-1:a1b2c3d4e5f6")
    event_id: Optional[int] = Field(None, description="Optional target event ID for coordinator validation", example=1)

    def get_token(self) -> str:
        return (self.qr_payload or self.qr_token or "").strip()


class GenerateQRResponse(BaseModel):
    registration_id: int
    event_id: int
    participant_name: str
    participant_email: str
    qr_token: str
    qr_payload: str
    checked_in: bool
    checked_in_at: Optional[datetime] = None


@router.get("/summary/{event_id}")
def get_attendance_summary(event_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Retrieves the real-time attendance summary for an event from PostgreSQL database:
    - Registered count
    - Expected (predicted) attendance
    - Present count (actual QR checked-in)
    - Absent count
    - Attendance percentage
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail=f"Event with ID {event_id} not found.")

    registered_count = db.query(EventRegistration).filter(
        EventRegistration.event_id == event_id,
        EventRegistration.status != "CANCELLED"
    ).count()

    present_count = db.query(EventRegistration).filter(
        EventRegistration.event_id == event_id,
        EventRegistration.checked_in == True,
        EventRegistration.status != "CANCELLED"
    ).count()

    expected_att = event.expected_participants or registered_count or 100
    absent_count = max(0, registered_count - present_count)
    att_pct = round((present_count / max(registered_count, 1)) * 100, 1)
    turnout_vs_pred = round((present_count / max(expected_att, 1)) * 100, 1)

    return {
        "event_id": event.id,
        "event_title": event.title,
        "registered": registered_count,
        "total_registered": registered_count,
        "expected_attendance": expected_att,
        "present": present_count,
        "present_count": present_count,
        "absent": absent_count,
        "absent_count": absent_count,
        "attendance_percentage": att_pct,
        "turnout_vs_prediction_pct": turnout_vs_pred,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/live/{event_id}")
def get_live_attendance(event_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Lightweight endpoint for live attendance count polling/updating.
    """
    return get_attendance_summary(event_id, db)


@router.post("/scan", status_code=status.HTTP_200_OK)
def scan_qr_attendance(
    payload: QRScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.FACULTY, UserRole.LOGISTICS]))
) -> Dict[str, Any]:

    """
    Processes a QR Code scan from an event coordinator:
    1. Validates QR payload token against PostgreSQL registrations.
    2. Prevents duplicate check-ins (returns 'Already Checked In').
    3. Rejects invalid/unknown QR codes (returns 'Invalid registration QR').
    4. Marks valid participant present in PostgreSQL with scan timestamp.
    5. Returns live attendance counts & status.
    """
    raw_token = payload.get_token()

    # 1. Search for matching registration by qr_token, ID, or register_number
    registration = None

    # Match exact qr_token
    registration = db.query(EventRegistration).filter(
        EventRegistration.qr_token == raw_token
    ).first()

    # If payload has prefix "EVENTIQ:REG-{id}:..."
    if not registration and "EVENTIQ:REG-" in raw_token:
        try:
            parts = raw_token.split(":")
            if len(parts) >= 2 and parts[1].startswith("REG-"):
                reg_id_str = parts[1].replace("REG-", "")
                reg_id = int(reg_id_str)
                registration = db.query(EventRegistration).filter(EventRegistration.id == reg_id).first()
        except Exception:
            pass

    # Fallback match by ID directly if raw_token is a numeric string
    if not registration and raw_token.isdigit():
        registration = db.query(EventRegistration).filter(EventRegistration.id == int(raw_token)).first()

    # Fallback match by register_number
    if not registration:
        registration = db.query(EventRegistration).filter(EventRegistration.register_number == raw_token).first()

    # INVALID QR CODE REJECTION
    if not registration:
        return {
            "success": False,
            "status": "INVALID",
            "result_code": "INVALID_QR",
            "message": "Invalid registration QR",
            "participant": None
        }

    # EVENT ID VALIDATION IF SPECIFIED
    if payload.event_id and registration.event_id != payload.event_id:
        return {
            "success": False,
            "status": "INVALID",
            "result_code": "EVENT_MISMATCH",
            "message": "Invalid registration QR for this specific event",
            "participant": None
        }

    # DUPLICATE SCAN PREVENTION
    if registration.checked_in:
        return {
            "success": False,
            "status": "DUPLICATE",
            "result_code": "ALREADY_CHECKED_IN",
            "message": "Already checked in",
            "participant": {
                "id": registration.id,
                "name": registration.participant_name,
                "email": registration.participant_email,
                "register_number": registration.register_number,
                "department": registration.department,
                "checked_in_at": registration.checked_in_at.isoformat() if registration.checked_in_at else None
            }
        }

    # SUCCESSFUL ATTENDANCE MARKING
    registration.checked_in = True
    registration.checked_in_at = datetime.utcnow()
    registration.status = "ATTENDED"
    db.commit()
    db.refresh(registration)

    # Evaluate automatic alerts (e.g. High Attendance / Low Attendance)
    from app.services.alert_service import evaluate_event_alerts
    evaluate_event_alerts(db, registration.event_id)

    # Compute updated summary
    summary = get_attendance_summary(registration.event_id, db)

    return {
        "success": True,
        "status": "SUCCESS",
        "result_code": "ATTENDANCE_MARKED",
        "message": "Attendance marked successfully",
        "participant": {
            "id": registration.id,
            "name": registration.participant_name,
            "email": registration.participant_email,
            "register_number": registration.register_number,
            "department": registration.department,
            "checked_in_at": registration.checked_in_at.isoformat()
        },
        "summary": summary
    }
