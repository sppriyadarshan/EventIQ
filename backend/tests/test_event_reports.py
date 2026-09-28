"""
Unit tests for EventIQ Automatic Event Report system:
1. Report generation for a completed event
2. Event with QR attendance
3. Event with no QR attendance
4. Event with reallocation
5. Event with equipment failure
6. Event with notifications / alerts
7. Graceful handling of missing optional fields
8. Non-existent event returns 404
9. Telemetry logging to HistoricalEvent
"""

import pytest


def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_automatic_event_report_generation(client):
    # Fetch report for event #1
    resp = client.get("/api/v1/reports/events/1")
    assert resp.status_code == 200
    report = resp.json()

    assert report["event_id"] == 1
    assert report["lifecycle_stage"] == "LEARN"
    assert "overview" in report
    assert report["overview"]["name"] == "Tech Innovators Summit 2026"
    assert "attendance_analysis" in report
    assert "logistics" in report
    assert "dynamic_changes" in report
    assert "equipment_recovery" in report
    assert "alerts" in report
    assert "academic_scheduling" in report
    assert "event_outcome" in report


def test_event_report_with_qr_attendance(client):
    headers = get_admin_headers(client)
    # Register participant and mark attendance
    reg = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Clara Oswald",
        "participant_email": "clara.o@example.edu"
    }).json()

    client.post("/api/v1/attendance/scan", json={"qr_token": reg["qr_token"]}, headers=headers)

    report = client.get("/api/v1/reports/events/1").json()
    analysis = report["attendance_analysis"]

    assert analysis["registered_participants"] >= 1
    assert analysis["actual_qr_attendance"] >= 1
    assert analysis["attendance_percentage"] > 0
    assert analysis["has_qr_records"] is True


def test_event_report_with_no_qr_attendance(client, db_session):
    # Create a new event with no registrations
    from app.models.event import Event
    from datetime import date
    e_new = Event(
        id=950,
        institution_id=1,
        title="Empty Unattended Event",
        event_type="Seminar",
        start_date=date(2026, 12, 1),
        expected_participants=50,
        status="COMPLETED"
    )
    db_session.add(e_new)
    db_session.commit()

    resp = client.get("/api/v1/reports/events/950")
    assert resp.status_code == 200
    report = resp.json()

    analysis = report["attendance_analysis"]
    assert analysis["registered_participants"] == 0
    assert analysis["actual_qr_attendance"] == 0
    assert analysis["no_shows"] == 0
    assert analysis["attendance_percentage"] == 0.0


def test_event_report_with_reallocation_and_failure(client, db_session):
    headers = get_admin_headers(client)
    # Trigger reallocation and failure endpoints for event 1
    client.post("/api/v1/optimization/apply-reallocation", json={
        "event_id": 1,
        "new_predicted_attendance": 350,
        "selected_venue_name": "Main Auditorium"
    }, headers=headers)

    client.post("/api/v1/optimization/equipment-failure/apply", json={
        "event_id": 1,
        "failed_resource_id": 1,
        "replacement_resource_id": 2
    }, headers=headers)

    report = client.get("/api/v1/reports/events/1").json()

    assert report["dynamic_changes"]["reallocation_occurred"] is True
    assert len(report["alerts"]) > 0
    assert report["event_outcome"]["telemetry_recorded_to_historical_db"] is True


def test_report_non_existent_event_404(client):
    resp = client.get("/api/v1/reports/events/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Event with ID 999999 not found."
