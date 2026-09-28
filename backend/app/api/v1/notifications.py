from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate, NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationOut])
def get_notifications(unread_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Notification).order_by(Notification.created_at.desc())
    if unread_only:
        query = query.filter(Notification.is_read == False)
    return query.all()


@router.post("/evaluate", response_model=List[NotificationOut])
def evaluate_all_alerts(db: Session = Depends(get_db)):
    """
    Triggers backend automatic alert evaluation across all active events in PostgreSQL.
    Detects Attendance Changes, Low Turnout, Resource Shortages, Equipment Failures,
    Reallocation Triggers, and Venue Conflicts.
    """
    from app.services.alert_service import evaluate_all_active_alerts
    evaluate_all_active_alerts(db)
    return db.query(Notification).order_by(Notification.created_at.desc()).all()


@router.post("/evaluate/{event_id}", response_model=List[NotificationOut])
def evaluate_event_alerts(event_id: int, db: Session = Depends(get_db)):
    """
    Triggers backend automatic alert evaluation for a specific event.
    """
    from app.services.alert_service import evaluate_event_alerts as eval_alerts
    eval_alerts(db, event_id)
    return db.query(Notification).filter(
        (Notification.related_event_id == event_id) | (Notification.related_event_id == None)
    ).order_by(Notification.created_at.desc()).all()


@router.post("", response_model=NotificationOut, status_code=status.HTTP_201_CREATED)
def create_notification(notif_in: NotificationCreate, db: Session = Depends(get_db)):
    notif = Notification(**notif_in.model_dump())
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


@router.get("/{notification_id}", response_model=NotificationOut)
def get_notification(notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif


@router.patch("/{notification_id}", response_model=NotificationOut)
def update_notification(notification_id: int, notif_in: NotificationUpdate, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    update_data = notif_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notif, field, value)
    
    db.commit()
    db.refresh(notif)
    return notif


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notif)
    db.commit()
    return None
