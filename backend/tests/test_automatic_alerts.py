"""
Unit tests for EventIQ Automatic Alert Engine:
- Attendance Change Alert (High Turnout)
- Low Attendance Alert (Low Turnout)
- Resource Shortage Alert
- Equipment Failure Alert
- Dynamic Reallocation Alert
- Venue / Scheduling Conflict Alert
- Duplicate Notification Prevention & PostgreSQL Persistence
"""

import pytest
import uuid
from app.models.notification import Notification
from app.models.resource import Resource
from app.models.event import Event, Venue
from app.models.registration import EventRegistration
from app.services.alert_service import evaluate_event_alerts, evaluate_all_active_alerts

def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_attendance_change_alert(client, db_session):
    headers = get_admin_headers(client)
    # Clean prior registrations & notifications for Event #1 to ensure clean test state
    db_session.query(Notification).filter(Notification.related_event_id == 1).delete()
    db_session.query(EventRegistration).filter(EventRegistration.event_id == 1).delete()
    db_session.commit()
    event = db_session.query(Event).filter(Event.id == 1).first()
    event.expected_participants = 20
    db_session.commit()

    tokens = []
    uid = uuid.uuid4().hex[:6]
    for i in range(25):
        r = client.post("/api/v1/registrations", json={
            "event_id": 1,
            "participant_name": f"Attendee {i}",
            "participant_email": f"attendee_{i}_{uid}@test.com"
        })
        assert r.status_code == 201
        tokens.append(r.json()["qr_token"])

    # Scan 24 participants -> 24 actual vs 20 predicted (exceeds 1.2x threshold)
    for tok in tokens[:24]:
        res = client.post("/api/v1/attendance/scan", json={"qr_token": tok}, headers=headers)
        assert res.status_code == 200, f"Scan failed: {res.text}"
        assert res.json()["success"] is True, f"Scan unsuccessful: {res.json()}"

    res_notif = client.post("/api/v1/notifications/evaluate/1")
    assert res_notif.status_code == 200
    notifs = res_notif.json()
    high_att_notif = [n for n in notifs if n.get("related_event_id") == 1 and "High Attendance Alert" in n.get("title", "")]
    assert len(high_att_notif) >= 1
    assert "Attendance is significantly above predicted demand" in high_att_notif[0]["message"]
    assert "24 actual vs 20 predicted" in high_att_notif[0]["message"]
    assert high_att_notif[0]["type"] == "WARNING"


def test_low_attendance_alert(client, db_session):
    headers = get_admin_headers(client)
    # Clean prior registrations & notifications for Event #1
    db_session.query(Notification).filter(Notification.related_event_id == 1).delete()
    db_session.query(EventRegistration).filter(EventRegistration.event_id == 1).delete()
    db_session.commit()
    event = db_session.query(Event).filter(Event.id == 1).first()
    event.expected_participants = 100
    db_session.commit()

    # Register 12 participants for Event #1
    tokens = []
    uid = uuid.uuid4().hex[:6]
    for i in range(12):
        r = client.post("/api/v1/registrations", json={
            "event_id": 1,
            "participant_name": f"LowTurnout User {i}",
            "participant_email": f"lowuser_{i}_{uid}@test.com"
        })
        assert r.status_code == 201
        tokens.append(r.json()["qr_token"])

    # Scan only 2 participants (2/100 = 2% < 60%)
    client.post("/api/v1/attendance/scan", json={"qr_token": tokens[0]}, headers=headers)
    client.post("/api/v1/attendance/scan", json={"qr_token": tokens[1]}, headers=headers)

    res_notif = client.post("/api/v1/notifications/evaluate/1")
    assert res_notif.status_code == 200
    notifs = res_notif.json()
    low_att_notif = [n for n in notifs if n.get("related_event_id") == 1 and "Low Attendance Alert" in n.get("title", "")]
    assert len(low_att_notif) >= 1
    assert "Attendance is below expected demand" in low_att_notif[0]["message"]


def test_equipment_failure_alert(client, db_session):
    headers = get_admin_headers(client)
    # Simulate equipment failure for resource #1
    resp = client.post("/api/v1/optimization/equipment-failure", json={
        "event_id": 1,
        "resource_id": 1,
        "failure_type": "PROJECTOR_FAILURE"
    }, headers=headers)
    assert resp.status_code == 200

    notifs = db_session.query(Notification).filter(Notification.related_event_id == 1).all()
    eq_notif = [n for n in notifs if "Critical Equipment Failure" in n.title or "Equipment" in n.title]
    assert len(eq_notif) >= 1
    assert eq_notif[0].type in ["CRITICAL", "WARNING"]
    assert "failure detected" in eq_notif[0].message.lower() or "recovered" in eq_notif[0].message.lower()


def test_resource_shortage_alert(client, db_session):
    # Set resource #1 available quantity to 0
    res = db_session.query(Resource).filter(Resource.id == 1).first()
    res.available_quantity = 0
    res.allocated_quantity = res.total_quantity
    db_session.commit()

    evaluate_event_alerts(db_session, 1)

    notifs = db_session.query(Notification).filter(Notification.related_event_id == 1).all()
    shortage_notif = [n for n in notifs if "Resource Shortage Alert" in n.title]
    assert len(shortage_notif) >= 1
    assert "Resource shortage detected" in shortage_notif[0].message


def test_reallocation_alert(client, db_session):
    headers = get_admin_headers(client)
    # Trigger dynamic reallocation preview for event #1
    resp = client.post("/api/v1/optimization/reallocate", json={
        "event_id": 1,
        "new_predicted_attendance": 350
    }, headers=headers)
    assert resp.status_code == 200

    notifs = db_session.query(Notification).filter(Notification.related_event_id == 1).all()
    realloc_notif = [n for n in notifs if "Reallocation Recommended" in n.title]
    assert len(realloc_notif) >= 1
    assert "Updated allocation recommended" in realloc_notif[0].message


def test_venue_scheduling_conflict_alert(client, db_session):
    # Set event #1 expected participants (600) to exceed venue capacity (500)
    event = db_session.query(Event).filter(Event.id == 1).first()
    event.expected_participants = 600
    db_session.commit()

    evaluate_event_alerts(db_session, 1)

    notifs = db_session.query(Notification).filter(Notification.related_event_id == 1).all()
    venue_notif = [n for n in notifs if "Venue Scheduling Conflict" in n.title]
    assert len(venue_notif) >= 1
    assert "Venue scheduling conflict detected" in venue_notif[0].message
    assert venue_notif[0].type == "CRITICAL"


def test_duplicate_notification_prevention(client, db_session):
    # Trigger evaluate_event_alerts multiple times
    evaluate_event_alerts(db_session, 1)
    eval1_count = db_session.query(Notification).filter(Notification.related_event_id == 1).count()

    evaluate_event_alerts(db_session, 1)
    eval2_count = db_session.query(Notification).filter(Notification.related_event_id == 1).count()

    # Total unread notification count should remain constant (no duplicate spamming)
    assert eval1_count == eval2_count


def test_notifications_api_evaluation_endpoint(client):
    headers = get_admin_headers(client)
    # Set event #1 expected participants > venue capacity to trigger a venue conflict alert
    event_res = client.post("/api/v1/optimization/reallocate", json={"event_id": 1, "new_predicted_attendance": 650}, headers=headers)
    assert event_res.status_code == 200

    # Call POST /api/v1/notifications/evaluate
    resp = client.post("/api/v1/notifications/evaluate")
    assert resp.status_code == 200
    notifs = resp.json()
    assert isinstance(notifs, list)
    assert len(notifs) >= 1
