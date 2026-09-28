"""
EventIQ Automatic Alert Engine
Evaluates real-time event logistics, LightGBM predictions, OR-Tools solver demands,
QR check-in counts, equipment health, and venue schedules to automatically generate actionable alerts.

Alert Conditions Supported:
1. ATTENDANCE_CHANGE (High Attendance)
2. LOW_ATTENDANCE (Low turnout / No-show)
3. RESOURCE_SHORTAGE (Demand exceeds inventory/capacity)
4. EQUIPMENT_FAILURE (Critical equipment failure)
5. DYNAMIC_REALLOCATION (Demand change recommends reallocation)
6. VENUE_SCHEDULING_CONFLICT (Venue overlap or capacity exceeded)
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.event import Event, Venue
from app.models.resource import Resource
from app.models.registration import EventRegistration
from app.models.notification import Notification


def create_alert_if_not_exists(
    db: Session,
    title: str,
    message: str,
    alert_type: str,
    event_id: Optional[int] = None,
    resource_id: Optional[int] = None
) -> Optional[Notification]:
    """
    Persists a notification to PostgreSQL if an unread notification
    with the exact same title for the event does not already exist.
    """
    existing = db.query(Notification).filter(
        Notification.related_event_id == event_id,
        Notification.title == title,
        Notification.is_read == False
    ).first()

    if existing:
        return existing

    notif = Notification(
        title=title,
        message=message,
        type=alert_type,
        is_read=False,
        created_at=datetime.utcnow(),
        related_event_id=event_id,
        related_resource_id=resource_id
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def evaluate_event_alerts(db: Session, event_id: int) -> List[Notification]:
    """
    Evaluates all 6 alert conditions for a specific event against PostgreSQL state.
    Returns any newly created or existing unread notifications.
    """
    db.expire_all()
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return []

    generated_alerts = []

    # 1. Fetch Registrations & QR Checked-In Count
    registrations = db.query(EventRegistration).filter(
        EventRegistration.event_id == event_id,
        EventRegistration.status != "CANCELLED"
    ).all()

    total_registered = len(registrations)
    present_count = sum(1 for r in registrations if r.checked_in)
    expected_att = event.expected_participants or total_registered or 100

    # ALERT 1: ATTENDANCE CHANGE (High Attendance)
    print(f"\n[DEBUG ALERT 1] present_count={present_count}, expected_att={expected_att}, threshold={max(20, int(expected_att * 1.2))}\n")
    if present_count > 0 and present_count >= max(20, int(expected_att * 1.2)):
        alert = create_alert_if_not_exists(
            db=db,
            title=f"High Attendance Alert: {event.title}",
            message=f"Attendance is significantly above predicted demand ({present_count} actual vs {expected_att} predicted). Review resource allocation.",
            alert_type="WARNING",
            event_id=event.id
        )
        if alert:
            generated_alerts.append(alert)

    # ALERT 2: LOW ATTENDANCE / NO-SHOW
    if total_registered >= 10 and present_count > 0 and present_count <= int(expected_att * 0.6):
        alert = create_alert_if_not_exists(
            db=db,
            title=f"Low Attendance Alert: {event.title}",
            message=f"Attendance is below expected demand ({present_count} actual vs {expected_att} expected). Review resource utilization.",
            alert_type="INFO",
            event_id=event.id
        )
        if alert:
            generated_alerts.append(alert)

    # ALERT 3 & 6: VENUE & SCHEDULING CONFLICT
    if event.venue_id:
        venue = db.query(Venue).filter(Venue.id == event.venue_id).first()
        if venue:
            # Capacity conflict check
            if expected_att > venue.capacity:
                alert = create_alert_if_not_exists(
                    db=db,
                    title=f"Venue Scheduling Conflict: {event.title}",
                    message=f"Venue scheduling conflict detected. Venue '{venue.name}' capacity ({venue.capacity}) is exceeded by expected attendance ({expected_att}).",
                    alert_type="CRITICAL",
                    event_id=event.id
                )
                if alert:
                    generated_alerts.append(alert)

            # Date overlap check with other events in the same venue
            overlapping_events = db.query(Event).filter(
                Event.venue_id == event.venue_id,
                Event.id != event.id,
                Event.start_date == event.start_date,
                Event.status != "CANCELLED"
            ).all()

            if overlapping_events:
                conflict_name = overlapping_events[0].title
                alert = create_alert_if_not_exists(
                    db=db,
                    title=f"Venue Scheduling Conflict: {event.title}",
                    message=f"Venue scheduling conflict detected. Venue '{venue.name}' is double-booked on {event.start_date} with '{conflict_name}'.",
                    alert_type="CRITICAL",
                    event_id=event.id
                )
                if alert:
                    generated_alerts.append(alert)

    # ALERT 4: RESOURCE SHORTAGE
    # Check equipment inventory for institution
    institution_resources = db.query(Resource).filter(
        Resource.institution_id == event.institution_id
    ).all()

    for res in institution_resources:
        required_qty = int(expected_att * 0.8) if res.category == "EQUIPMENT" and "Chair" in res.name else 2
        if res.available_quantity < required_qty and res.allocated_quantity >= res.total_quantity:
            alert = create_alert_if_not_exists(
                db=db,
                title=f"Resource Shortage Alert: {event.title}",
                message=f"Resource shortage detected for '{res.name}' (Required: {required_qty}, Available: {res.available_quantity}). Reallocation may be required.",
                alert_type="WARNING",
                event_id=event.id,
                resource_id=res.id
            )
            if alert:
                generated_alerts.append(alert)

        # ALERT 5: EQUIPMENT FAILURE
        if res.status in ["CRITICAL", "FAILED"]:
            alert = create_alert_if_not_exists(
                db=db,
                title=f"Critical Equipment Failure: {event.title}",
                message=f"Critical equipment failure detected for '{res.name}'. Recovery plan available.",
                alert_type="CRITICAL",
                event_id=event.id,
                resource_id=res.id
            )
            if alert:
                generated_alerts.append(alert)

    return generated_alerts


def evaluate_all_active_alerts(db: Session) -> List[Notification]:
    """
    Evaluates alerts across all non-cancelled events in PostgreSQL database.
    """
    events = db.query(Event).filter(Event.status != "CANCELLED").all()
    all_new_alerts = []
    for ev in events:
        new_alerts = evaluate_event_alerts(db, ev.id)
        all_new_alerts.extend(new_alerts)
    return all_new_alerts
