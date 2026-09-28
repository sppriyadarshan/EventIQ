"""
Unit tests for EventIQ QR Attendance system with Role-Based Authentication:
- QR token generation
- Valid QR attendance scan
- Duplicate QR scan ("Already Checked In")
- Invalid/unknown QR code rejection
- Attendance summary and live counts
"""

import uuid
import pytest


def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_qr_token_generation(client):
    headers = get_admin_headers(client)
    unique_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    # Register a new participant
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Jane Doe",
        "participant_email": unique_email,
        "department": "CSE"
    }, headers=headers)
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "qr_token" in data
    assert data["qr_token"].startswith("EVENTIQ:REG-")

    # Fetch QR details
    reg_id = data["id"]
    qr_resp = client.get(f"/api/v1/registrations/{reg_id}/qr", headers=headers)
    assert qr_resp.status_code == 200
    qr_data = qr_resp.json()
    assert qr_data["qr_token"] == data["qr_token"]
    assert qr_data["participant_name"] == "Jane Doe"


def test_valid_qr_scan(client):
    headers = get_admin_headers(client)
    unique_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    # Register participant
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "John Smith",
        "participant_email": unique_email,
        "department": "ECE"
    }, headers=headers)
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    qr_token = data["qr_token"]

    # Perform valid scan
    scan_resp = client.post("/api/v1/attendance/scan", json={
        "qr_token": qr_token
    }, headers=headers)
    assert scan_resp.status_code == 200
    scan_data = scan_resp.json()
    assert scan_data["status"] == "SUCCESS"
    assert scan_data["result_code"] == "ATTENDANCE_MARKED"
    assert scan_data["message"] == "Attendance marked successfully"
    assert scan_data["participant"]["checked_in_at"] is not None


def test_duplicate_qr_scan(client):
    headers = get_admin_headers(client)
    unique_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    # Register participant
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Alice Cooper",
        "participant_email": unique_email
    }, headers=headers)
    assert reg_resp.status_code == 201
    qr_token = reg_resp.json()["qr_token"]

    # First scan -> SUCCESS
    scan1 = client.post("/api/v1/attendance/scan", json={"qr_token": qr_token}, headers=headers)
    assert scan1.status_code == 200
    assert scan1.json()["status"] == "SUCCESS"

    # Second scan -> DUPLICATE ("Already Checked In")
    scan2 = client.post("/api/v1/attendance/scan", json={"qr_token": qr_token}, headers=headers)
    assert scan2.status_code == 200
    assert scan2.json()["status"] == "DUPLICATE"
    assert scan2.json()["message"] == "Already checked in"


def test_invalid_qr_scan(client):
    headers = get_admin_headers(client)
    # Scan non-existent or invalid token
    scan_resp = client.post("/api/v1/attendance/scan", json={"qr_token": "INVALID-QR-TOKEN-99999"}, headers=headers)
    assert scan_resp.status_code == 200
    scan_data = scan_resp.json()
    assert scan_data["status"] == "INVALID"
    assert scan_data["message"] == "Invalid registration QR"


def test_attendance_summary_and_live_count(client):
    headers = get_admin_headers(client)
    # Register 3 participants for Event #1
    tokens = []
    for i in range(3):
        unique_email = f"test_sum_{i}_{uuid.uuid4().hex[:6]}@example.com"
        r = client.post("/api/v1/registrations", json={
            "event_id": 1,
            "participant_name": f"User {i}",
            "participant_email": unique_email
        }, headers=headers)
        assert r.status_code == 201
        tokens.append(r.json()["qr_token"])

    # Scan 2 out of 3
    client.post("/api/v1/attendance/scan", json={"qr_token": tokens[0]}, headers=headers)
    client.post("/api/v1/attendance/scan", json={"qr_token": tokens[1]}, headers=headers)

    # Fetch live attendance
    live_resp = client.get("/api/v1/attendance/live/1", headers=headers)
    assert live_resp.status_code == 200
    live_data = live_resp.json()
    assert live_data["event_id"] == 1
    assert live_data["total_registered"] >= 3
    assert live_data["present_count"] >= 2
    assert live_data["absent_count"] == live_data["total_registered"] - live_data["present_count"]

    # Fetch summary
    summary_resp = client.get("/api/v1/attendance/summary/1", headers=headers)
    assert summary_resp.status_code == 200
    summary_data = summary_resp.json()
    assert summary_data["present"] >= 2
    assert summary_data["attendance_percentage"] > 0
