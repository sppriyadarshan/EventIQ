"""
Unit tests for EventIQ Personalized QR Event Pass feature:
1. Valid registration returns personalized pass
2. Invalid registration returns 404
3. Correct student information returned
4. Correct event information returned
5. Correct venue returned
6. Attendance status returned
7. Already checked-in registration handled correctly
8. Different registrations return different personalized pass information
9. Dynamic database-backed data validation
"""

import pytest
from datetime import date


def test_valid_registration_returns_personalized_pass(client):
    # 1. Register a participant for Event #1
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Samantha Reed",
        "participant_email": "samantha.r@example.edu",
        "register_number": "2026CSE099",
        "department": "CSE",
        "year": "3rd Year"
    })
    assert reg_resp.status_code == 201
    reg_data = reg_resp.json()
    reg_id = reg_data["id"]

    # 2. Fetch pass via GET /api/v1/registrations/{reg_id}/pass
    pass_resp = client.get(f"/api/v1/registrations/{reg_id}/pass")
    assert pass_resp.status_code == 200
    pass_data = pass_resp.json()

    # Validate structure & field values
    assert pass_data["registration_id"] == f"REG-{reg_id}"
    assert pass_data["student_name"] == "Samantha Reed"
    assert pass_data["participant_email"] == "samantha.r@example.edu"
    assert pass_data["register_number"] == "2026CSE099"
    assert pass_data["department"] == "CSE"

    # Event details
    assert pass_data["event"]["name"] == "Tech Innovators Summit 2026"
    assert pass_data["event"]["theme"] == "AI & Intelligent Future"
    assert pass_data["event"]["theme_id"] == "AI-07"

    # Venue details
    assert pass_data["venue"]["name"] == "Main Auditorium"

    # Schedule & Food
    assert pass_data["schedule"]["date"] == "2026-10-15"
    assert "food" in pass_data
    assert "details" in pass_data["food"]

    # Attendance state
    assert pass_data["registration_status"] == "REGISTERED"
    assert pass_data["attendance"]["checked_in"] is False
    assert pass_data["attendance"]["checked_in_at"] is None


def test_invalid_registration_returns_404(client):
    pass_resp = client.get("/api/v1/registrations/999999/pass")
    assert pass_resp.status_code == 404
    assert pass_resp.json()["detail"] == "Registration not found"


def test_pass_lookup_by_formatted_id_and_token(client):
    # Register participant
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Marcus Vance",
        "participant_email": "marcus.v@example.edu",
        "register_number": "2026ECE055"
    })
    reg_data = reg_resp.json()
    reg_id = reg_data["id"]
    qr_token = reg_data["qr_token"]

    # Lookup by REG- formatted ID string
    pass_by_formatted = client.get(f"/api/v1/registrations/REG-{reg_id}/pass")
    assert pass_by_formatted.status_code == 200
    assert pass_by_formatted.json()["student_name"] == "Marcus Vance"

    # Lookup by full QR token payload
    pass_by_token = client.get(f"/api/v1/registrations/{qr_token}/pass")
    assert pass_by_token.status_code == 200
    assert pass_by_token.json()["student_name"] == "Marcus Vance"


def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_already_checked_in_pass_state(client):
    headers = get_admin_headers(client)
    # Register & scan participant
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Elena Rostova",
        "participant_email": "elena.r@example.edu",
        "register_number": "2026AIML011"
    })
    reg_data = reg_resp.json()
    qr_token = reg_data["qr_token"]
    reg_id = reg_data["id"]

    # Mark attendance
    scan_resp = client.post("/api/v1/attendance/scan", json={"qr_token": qr_token}, headers=headers)
    assert scan_resp.status_code == 200
    assert scan_resp.json()["status"] == "SUCCESS"

    # Fetch pass again -> should reflect checked_in = True
    pass_resp = client.get(f"/api/v1/registrations/{reg_id}/pass")
    assert pass_resp.status_code == 200
    pass_data = pass_resp.json()

    assert pass_data["attendance"]["checked_in"] is True
    assert pass_data["attendance"]["checked_in_at"] is not None
    assert pass_data["registration_status"] == "ATTENDED"


def test_different_registrations_return_different_personalized_passes(client, db_session):
    # Create a new venue and event
    from app.models.event import Event, Venue
    v_new = Venue(id=99, institution_id=1, name="Innovation Hub Hall", capacity=150)
    db_session.add(v_new)
    db_session.commit()

    e2 = Event(
        id=2,
        institution_id=1,
        title="CyberSecurity Workshop 2026",
        event_type="Workshop",
        venue_id=99,
        start_date=date(2026, 11, 20),
        theme="Zero-Trust Architecture",
        theme_id="SEC-99",
        food_details="Coffee & Donuts"
    )
    db_session.add(e2)
    db_session.commit()

    # Register Student A for Event #1
    reg1 = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Student A",
        "participant_email": "studentA@example.edu"
    }).json()

    # Register Student B for Event #2
    reg2 = client.post("/api/v1/registrations", json={
        "event_id": 2,
        "participant_name": "Student B",
        "participant_email": "studentB@example.edu"
    }).json()

    pass1 = client.get(f"/api/v1/registrations/{reg1['id']}/pass").json()
    pass2 = client.get(f"/api/v1/registrations/{reg2['id']}/pass").json()

    assert pass1["student_name"] == "Student A"
    assert pass1["event"]["name"] == "Tech Innovators Summit 2026"
    assert pass1["venue"]["name"] == "Main Auditorium"

    assert pass2["student_name"] == "Student B"
    assert pass2["event"]["name"] == "CyberSecurity Workshop 2026"
    assert pass2["event"]["theme"] == "Zero-Trust Architecture"
    assert pass2["event"]["theme_id"] == "SEC-99"
    assert pass2["venue"]["name"] == "Innovation Hub Hall"
    assert pass2["food"]["details"] == "Coffee & Donuts"

