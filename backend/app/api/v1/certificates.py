import os
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user_optional, get_current_user
from app.models.user import UserRole, User
from app.models.registration import EventRegistration
from app.models.event import Event, Venue
from app.models.certificate import Certificate
from app.services.pdf_generator import generate_certificate_pdf

router = APIRouter(prefix="/certificates", tags=["Certificates"])



def parse_registration_id(raw_id: str, db: Session) -> Optional[EventRegistration]:
    """Helper to parse numeric ID, REG- prefix, or QR token into EventRegistration."""
    token = str(raw_id).strip()

    if token.isdigit():
        return db.query(EventRegistration).filter(EventRegistration.id == int(token)).first()
    elif token.startswith("REG-"):
        try:
            reg_id = int(token.replace("REG-", ""))
            return db.query(EventRegistration).filter(EventRegistration.id == reg_id).first()
        except ValueError:
            pass
    elif "EVENTIQ:REG-" in token:
        try:
            parts = token.split(":")
            if len(parts) >= 2 and parts[1].startswith("REG-"):
                reg_id = int(parts[1].replace("REG-", ""))
                return db.query(EventRegistration).filter(EventRegistration.id == reg_id).first()
        except ValueError:
            pass

    # Fallback exact qr_token match
    reg = db.query(EventRegistration).filter(EventRegistration.qr_token == token).first()
    if reg:
        return reg

    # Fallback register_number match
    return db.query(EventRegistration).filter(EventRegistration.register_number == token).first()


@router.get("/{registration_id}/eligibility", status_code=status.HTTP_200_OK)
def check_certificate_eligibility(
    registration_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Backend Source of Truth: Checks certificate eligibility for a participant based on PostgreSQL attendance data.
    Rule: Registered AND Checked-In -> COMPLETED -> ELIGIBLE.
    """
    reg = parse_registration_id(registration_id, db)
    if not reg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Registration '{registration_id}' not found."
        )

    # Ownership check for PARTICIPANT role
    if current_user and current_user.role == UserRole.PARTICIPANT:
        if reg.participant_email.lower() != current_user.email.lower() and reg.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only view your own certificate eligibility."
            )

    # Check if participant is checked in
    is_checked_in = bool(reg.checked_in or reg.status == "ATTENDED")

    existing_cert = db.query(Certificate).filter(Certificate.registration_id == reg.id).first()

    if is_checked_in:
        cert_id = existing_cert.certificate_id if existing_cert else f"EVIQ-2026-{reg.id:06d}"
        return {
            "eligible": True,
            "participation_status": "COMPLETED",
            "registration_id": f"REG-{reg.id}",
            "student_name": reg.participant_name,
            "event_id": reg.event_id,
            "certificate_id": cert_id,
            "certificate_exists": bool(existing_cert),
            "checked_in_at": reg.checked_in_at.isoformat() if reg.checked_in_at else None
        }
    else:
        return {
            "eligible": False,
            "participation_status": "REGISTERED",
            "registration_id": f"REG-{reg.id}",
            "student_name": reg.participant_name,
            "event_id": reg.event_id,
            "reason": "Participant has not checked in. Check in to the event to become eligible for the participation certificate."
        }


@router.post("/{registration_id}/generate", status_code=status.HTTP_200_OK)
def generate_certificate(
    registration_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Generates an official Certificate of Participation for an eligible checked-in participant.
    1. Re-validates eligibility on the backend (blocks non-attendees).
    2. Prevents duplicate certificates (returns existing certificate if already generated).
    3. Persists certificate record to PostgreSQL.
    4. Generates PDF with embedded Verification QR Code.
    """
    reg = parse_registration_id(registration_id, db)
    if not reg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Registration '{registration_id}' not found."
        )

    # Ownership check for PARTICIPANT role
    if current_user and current_user.role == UserRole.PARTICIPANT:
        if reg.participant_email.lower() != current_user.email.lower() and reg.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only generate your own certificate."
            )


    # BACKEND ELIGIBILITY VALIDATION (Never trust frontend state)
    if not (reg.checked_in or reg.status == "ATTENDED"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Participant has not checked in. Certificate generation is locked until attendance is verified."
        )

    def format_cert_response(cert_obj, status_label="ISSUED", is_existing=False):
        reg_disp = cert_obj.registration_id_display or f"REG-{cert_obj.registration_id}"
        v_url = f"http://localhost:3000/certificate/verify?id={cert_obj.certificate_id}"
        d_url = f"/api/v1/certificates/download/{cert_obj.certificate_id}"
        cert_data = {
            "id": cert_obj.id,
            "certificate_id": cert_obj.certificate_id,
            "registration_id": reg_disp,
            "registration_id_display": reg_disp,
            "student_name": cert_obj.student_name,
            "event_name": cert_obj.event_name,
            "institution_name": cert_obj.institution_name,
            "event_date": cert_obj.event_date,
            "venue_name": cert_obj.venue_name,
            "organizer_name": cert_obj.organizer_name,
            "issued_at": cert_obj.issued_at.isoformat() if cert_obj.issued_at else None,
            "verification_token": cert_obj.verification_token,
            "verification_url": v_url,
            "download_url": d_url,
            "status": cert_obj.status
        }
        return {
            "success": True,
            "status": status_label,
            "message": "Certificate already generated." if is_existing else "Certificate generated successfully.",
            "eligible": True,
            "participation_status": "COMPLETED",
            "certificate_id": cert_obj.certificate_id,
            "registration_id": reg_disp,
            "registration_id_display": reg_disp,
            "student_name": cert_obj.student_name,
            "event_name": cert_obj.event_name,
            "institution_name": cert_obj.institution_name,
            "event_date": cert_obj.event_date,
            "venue_name": cert_obj.venue_name,
            "organizer_name": cert_obj.organizer_name,
            "issued_at": cert_obj.issued_at.isoformat() if cert_obj.issued_at else None,
            "verification_token": cert_obj.verification_token,
            "verification_url": v_url,
            "download_url": d_url,
            "certificate": cert_data
        }

    # DUPLICATE PREVENTION: Return existing certificate if already generated
    existing_cert = db.query(Certificate).filter(Certificate.registration_id == reg.id).first()
    if existing_cert:
        return format_cert_response(existing_cert, status_label="ISSUED", is_existing=True)

    # Fetch Event & Venue details from PostgreSQL relationships
    event = db.query(Event).filter(Event.id == reg.event_id).first()
    venue = event.venue if event else None

    # Generate unique Certificate ID (Format: EVIQ-YYYY-XXXXXX)
    cert_id = f"EVIQ-2026-{reg.id:06d}"

    # Ensure certificate_id uniqueness
    collision_check = db.query(Certificate).filter(Certificate.certificate_id == cert_id).first()
    if collision_check:
        cert_id = f"EVIQ-2026-{reg.id:04d}{uuid.uuid4().hex[:2].upper()}"

    verification_token = f"VERIFY-{uuid.uuid4().hex[:16].upper()}"

    event_name = event.title if event else "EventIQ Campus Event"
    institution_name = event.institution.name if (event and event.institution) else "EventIQ Institute of Technology"
    event_date_str = event.start_date.strftime("%B %d, %Y") if (event and event.start_date) else "October 15, 2026"
    venue_name_str = venue.name if venue else "Main Auditorium"
    organizer_str = event.organizer if (event and event.organizer) else "EventIQ Academic Committee"
    reg_display = f"REG-{reg.id}"

    # Create & Save Certificate record in PostgreSQL
    new_cert = Certificate(
        certificate_id=cert_id,
        registration_id=reg.id,
        event_id=reg.event_id,
        student_name=reg.participant_name,
        event_name=event_name,
        institution_name=institution_name,
        event_date=event_date_str,
        venue_name=venue_name_str,
        registration_id_display=reg_display,
        organizer_name=organizer_str,
        verification_token=verification_token,
        status="VALID"
    )

    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)

    return format_cert_response(new_cert, status_label="ISSUED", is_existing=False)


@router.get("/download/{certificate_id}")
def download_certificate_pdf(
    certificate_id: str,
    db: Session = Depends(get_db)
):
    """
    Generates and streams a real PDF Certificate of Participation with embedded verification QR.
    """
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    if not cert:
        # Try matching by verification_token
        cert = db.query(Certificate).filter(Certificate.verification_token == certificate_id).first()

    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate '{certificate_id}' not found."
        )

    # Verification URL encoded into QR Code on the PDF
    verification_url = f"http://localhost:3000/certificate/verify?id={cert.certificate_id}"

    # Generate real ReportLab PDF
    pdf_bytes = generate_certificate_pdf(
        student_name=cert.student_name,
        event_name=cert.event_name,
        institution_name=cert.institution_name,
        event_date=cert.event_date,
        venue_name=cert.venue_name,
        registration_id_display=cert.registration_id_display or f"REG-{cert.registration_id}",
        certificate_id=cert.certificate_id,
        organizer_name=cert.organizer_name,
        verification_url=verification_url
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=EventIQ_Certificate_{cert.certificate_id}.pdf"
        }
    )


@router.get("/verify/{certificate_id}")
def verify_certificate(
    certificate_id: str,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Verifies certificate authenticity against PostgreSQL database records.
    Queryable by Certificate ID (e.g. EVIQ-2026-000001) or Verification Token.
    """
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id.strip()).first()
    if not cert:
        cert = db.query(Certificate).filter(Certificate.verification_token == certificate_id.strip()).first()

    if not cert or cert.status != "VALID":
        return {
            "valid": False,
            "message": "Certificate not found or invalid."
        }

    return {
        "valid": True,
        "certificate_id": cert.certificate_id,
        "registration_id_display": cert.registration_id_display or f"REG-{cert.registration_id}",
        "student_name": cert.student_name,
        "event_name": cert.event_name,
        "institution": cert.institution_name,
        "event_date": cert.event_date,
        "venue": cert.venue_name,
        "organizer_name": cert.organizer_name,
        "issued_at": cert.issued_at.isoformat() if cert.issued_at else None,
        "status": cert.status
    }
