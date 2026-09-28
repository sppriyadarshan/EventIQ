import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user_optional
from app.models.user import UserRole, User
from app.models.registration import EventRegistration
from app.models.event import Event
from app.schemas.registration import RegistrationCreate, RegistrationUpdate, RegistrationOut

router = APIRouter(prefix="/registrations", tags=["Registrations"])


@router.get("", response_model=List[RegistrationOut])
def get_registrations(
    event_id: Optional[int] = None,
    participant_email: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(EventRegistration)

    # Filter by user if participant
    if current_user and current_user.role == UserRole.PARTICIPANT:
        query = query.filter(
            (EventRegistration.participant_email.ilike(current_user.email)) |
            (EventRegistration.user_id == current_user.id)
        )
    elif participant_email:
        query = query.filter(EventRegistration.participant_email.ilike(participant_email))

    if event_id:
        query = query.filter(EventRegistration.event_id == event_id)

    return query.all()



@router.post("", response_model=RegistrationOut, status_code=status.HTTP_201_CREATED)
def create_registration(reg_in: RegistrationCreate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == reg_in.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # 1. Duplicate registration prevention
    existing = db.query(EventRegistration).filter(
        EventRegistration.event_id == reg_in.event_id,
        EventRegistration.participant_email == reg_in.participant_email
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Participant with email '{reg_in.participant_email}' is already registered for this event."
        )
    
    # 2. Capacity validation
    db.expire_all()
    current_count = db.query(EventRegistration).filter(
        EventRegistration.event_id == reg_in.event_id,
        EventRegistration.status != "CANCELLED"
    ).count()
    
    print(f"\n[DEBUG REGISTRATION] event_id={event.id}, capacity={event.capacity}, current_count={current_count}\n")
    
    reg_status = "REGISTERED"
    if event.capacity and current_count >= event.capacity:
        reg_status = "WAITLISTED"

    registration = EventRegistration(
        **reg_in.model_dump(),
        status=reg_status
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)

    # Generate unique QR token
    if not registration.qr_token:
        registration.qr_token = f"EVENTIQ:REG-{registration.id}:{uuid.uuid4().hex[:12]}"
        db.commit()
        db.refresh(registration)

    return registration


@router.get("/{registration_id}", response_model=RegistrationOut)
def get_registration(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    if not reg.qr_token:
        reg.qr_token = f"EVENTIQ:REG-{reg.id}:{uuid.uuid4().hex[:12]}"
        db.commit()
        db.refresh(reg)
    return reg


@router.get("/{registration_id}/qr")
def get_registration_qr(registration_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Retrieves or generates the secure QR code token and payload for a participant's registration.
    """
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    if not reg.qr_token:
        reg.qr_token = f"EVENTIQ:REG-{reg.id}:{uuid.uuid4().hex[:12]}"
        db.commit()
        db.refresh(reg)

    event = db.query(Event).filter(Event.id == reg.event_id).first()

    return {
        "registration_id": reg.id,
        "event_id": reg.event_id,
        "event_title": event.title if event else "EventIQ Campus Event",
        "participant_name": reg.participant_name,
        "participant_email": reg.participant_email,
        "register_number": reg.register_number,
        "department": reg.department,
        "qr_token": reg.qr_token,
        "qr_payload": reg.qr_token,
        "checked_in": reg.checked_in,
        "checked_in_at": reg.checked_in_at.isoformat() if reg.checked_in_at else None,
        "status": reg.status
    }


@router.get("/{registration_id}/pass")
def get_personalized_event_pass(
    registration_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Retrieves the Personalized QR Event Pass for a registration from PostgreSQL database.
    Accepts numeric ID (e.g. '1'), formatted ID (e.g. 'REG-1'), or raw QR token payload.
    """
    reg = None
    raw_token = registration_id.strip()

    # 1. Try parsing numeric ID directly or from REG- prefix / token payload
    if raw_token.isdigit():
        reg = db.query(EventRegistration).filter(EventRegistration.id == int(raw_token)).first()
    elif raw_token.startswith("REG-"):
        try:
            reg_id = int(raw_token.replace("REG-", ""))
            reg = db.query(EventRegistration).filter(EventRegistration.id == reg_id).first()
        except ValueError:
            pass
    elif "EVENTIQ:REG-" in raw_token:
        try:
            parts = raw_token.split(":")
            if len(parts) >= 2 and parts[1].startswith("REG-"):
                reg_id = int(parts[1].replace("REG-", ""))
                reg = db.query(EventRegistration).filter(EventRegistration.id == reg_id).first()
        except ValueError:
            pass

    # 2. Try matching exact qr_token
    if not reg:
        reg = db.query(EventRegistration).filter(EventRegistration.qr_token == raw_token).first()

    # 3. Try matching register_number
    if not reg:
        reg = db.query(EventRegistration).filter(EventRegistration.register_number == raw_token).first()

    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    # Ownership check for PARTICIPANT role
    if current_user and current_user.role == UserRole.PARTICIPANT:
        if reg.participant_email.lower() != current_user.email.lower() and reg.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only view your own event pass."
            )


    # Ensure qr_token exists
    if not reg.qr_token:
        reg.qr_token = f"EVENTIQ:REG-{reg.id}:{uuid.uuid4().hex[:12]}"
        db.commit()
        db.refresh(reg)

    event = db.query(Event).filter(Event.id == reg.event_id).first()
    venue = event.venue if event else None

    # Construct clean, structured pass details
    event_name = event.title if event else "EventIQ Campus Event"
    event_theme = (event.theme if event and event.theme else (event.description if event and event.description else "AI & Intelligent Future"))
    event_theme_id = (event.theme_id if event and event.theme_id else (f"THM-{event.id:02d}" if event else "THM-01"))
    venue_name = venue.name if venue else "Main Campus Venue"
    
    event_date = event.start_date.isoformat() if event and event.start_date else "2026-10-15"
    start_time = event.start_time.strftime("%H:%M") if event and event.start_time else "09:30"
    end_time = event.end_time.strftime("%H:%M") if event and event.end_time else "17:00"
    food_details = (event.food_details if event and event.food_details else "Lunch + Refreshments")

    return {
        "registration_id": f"REG-{reg.id}",
        "raw_registration_id": reg.id,
        "student_name": reg.participant_name,
        "participant_name": reg.participant_name,
        "participant_email": reg.participant_email,
        "register_number": reg.register_number,
        "department": reg.department,
        "year": reg.year,
        "event_id": reg.event_id,
        "event": {
            "id": event.id if event else None,
            "name": event_name,
            "title": event_name,
            "theme": event_theme,
            "theme_id": event_theme_id
        },
        "venue": {
            "id": venue.id if venue else None,
            "name": venue_name
        },
        "schedule": {
            "date": event_date,
            "start_time": start_time,
            "end_time": end_time
        },
        "food": {
            "details": food_details
        },
        "registration_status": reg.status or "REGISTERED",
        "attendance": {
            "checked_in": bool(reg.checked_in),
            "checked_in_at": reg.checked_in_at.isoformat() if reg.checked_in_at else None
        },
        "qr_token": reg.qr_token
    }



@router.post("/{registration_id}/generate-qr")
def generate_registration_qr(registration_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Forces generation/refresh of a secure QR code token.
    """
    return get_registration_qr(registration_id, db)


@router.patch("/{registration_id}", response_model=RegistrationOut)
def update_registration(registration_id: int, reg_in: RegistrationUpdate, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    update_data = reg_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reg, field, value)
    
    db.commit()
    db.refresh(reg)
    return reg


@router.post("/{registration_id}/cancel", response_model=RegistrationOut)
def cancel_registration(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    reg.status = "CANCELLED"
    db.commit()
    db.refresh(reg)
    return reg


@router.delete("/{registration_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_registration(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    db.delete(reg)
    db.commit()
    return None
