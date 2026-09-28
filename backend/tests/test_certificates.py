"""
Unit tests for EventIQ Automatic Certificate Generator & Certificate Verification System:
1. Registered + not checked in -> NOT eligible
2. Registered + checked in -> COMPLETED + eligible
3. Generate certificate for eligible participant -> certificate created
4. Generate certificate twice -> same certificate returned, no duplicate
5. Generate certificate for non-attendee -> rejected
6. Certificate ID is unique
7. Certificate PDF is generated successfully
8. Valid certificate ID -> VALID CERTIFICATE
9. Invalid certificate ID -> INVALID CERTIFICATE
10. QR verification URL points to verification page
11. Certificate data matches PostgreSQL event/registration data
"""

import pytest


def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_registered_not_checked_in_ineligible(client):
    # 1. Register a participant
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Alice Unchecked",
        "participant_email": "alice.u@example.edu",
        "register_number": "2026CS101"
    })
    assert reg_resp.status_code == 201
    reg_id = reg_resp.json()["id"]

    # 2. Check eligibility
    elig_resp = client.get(f"/api/v1/certificates/{reg_id}/eligibility")
    assert elig_resp.status_code == 200
    elig_data = elig_resp.json()

    assert elig_data["eligible"] is False
    assert elig_data["participation_status"] == "REGISTERED"
    assert "not checked in" in elig_data["reason"].lower()


def test_registered_and_checked_in_eligible(client):
    headers = get_admin_headers(client)
    # 1. Register a participant
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Bob CheckedIn",
        "participant_email": "bob.c@example.edu",
        "register_number": "2026CS102"
    })
    reg_data = reg_resp.json()
    reg_id = reg_data["id"]
    qr_token = reg_data["qr_token"]

    # 2. Mark attendance
    scan_resp = client.post("/api/v1/attendance/scan", json={"qr_token": qr_token}, headers=headers)
    assert scan_resp.status_code == 200

    # 3. Check eligibility
    elig_resp = client.get(f"/api/v1/certificates/{reg_id}/eligibility")
    assert elig_resp.status_code == 200
    elig_data = elig_resp.json()

    assert elig_data["eligible"] is True
    assert elig_data["participation_status"] == "COMPLETED"


def test_generate_certificate_for_eligible_participant(client):
    headers = get_admin_headers(client)
    # Register & check in
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Charlie Winner",
        "participant_email": "charlie.w@example.edu",
        "register_number": "2026CS103"
    })
    reg_data = reg_resp.json()
    reg_id = reg_data["id"]

    client.post("/api/v1/attendance/scan", json={"qr_token": reg_data["qr_token"]}, headers=headers)

    # Generate certificate
    gen_resp = client.post(f"/api/v1/certificates/{reg_id}/generate")
    assert gen_resp.status_code == 200
    cert_data = gen_resp.json()

    assert cert_data["status"] == "ISSUED"
    assert cert_data["certificate_id"].startswith("EVIQ-")
    assert cert_data["student_name"] == "Charlie Winner"
    assert cert_data["event_name"] == "Tech Innovators Summit 2026"
    assert "verification_url" in cert_data


def test_generate_certificate_twice_no_duplicates(client):
    headers = get_admin_headers(client)
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Diana Repeat",
        "participant_email": "diana.r@example.edu",
        "register_number": "2026CS104"
    })
    reg_data = reg_resp.json()
    reg_id = reg_data["id"]
    client.post("/api/v1/attendance/scan", json={"qr_token": reg_data["qr_token"]}, headers=headers)

    # Generate first time
    gen1 = client.post(f"/api/v1/certificates/{reg_id}/generate").json()

    # Generate second time
    gen2 = client.post(f"/api/v1/certificates/{reg_id}/generate").json()

    # Must return exact same certificate_id
    assert gen1["certificate_id"] == gen2["certificate_id"]
    assert gen1["certificate"]["id"] == gen2["certificate"]["id"]


def test_generate_certificate_for_non_attendee_rejected(client):
    reg_resp = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Evan Absent",
        "participant_email": "evan.a@example.edu",
        "register_number": "2026CS105"
    })
    reg_id = reg_resp.json()["id"]

    # Try generating without check-in
    gen_resp = client.post(f"/api/v1/certificates/{reg_id}/generate")
    assert gen_resp.status_code == 400
    assert "not eligible" in gen_resp.json()["detail"].lower() or "not checked in" in gen_resp.json()["detail"].lower()


def test_certificate_id_uniqueness(client):
    headers = get_admin_headers(client)
    cids = set()
    for i in range(3):
        reg = client.post("/api/v1/registrations", json={
            "event_id": 1,
            "participant_name": f"User {i}",
            "participant_email": f"user{i}@example.edu",
            "register_number": f"2026CS20{i}"
        }).json()
        client.post("/api/v1/attendance/scan", json={"qr_token": reg["qr_token"]}, headers=headers)
        cert = client.post(f"/api/v1/certificates/{reg['id']}/generate").json()
        cids.add(cert["certificate_id"])

    assert len(cids) == 3


def test_pdf_certificate_download(client):
    headers = get_admin_headers(client)
    reg = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Fiona PDFTest",
        "participant_email": "fiona.p@example.edu",
        "register_number": "2026CS106"
    }).json()
    client.post("/api/v1/attendance/scan", json={"qr_token": reg["qr_token"]}, headers=headers)
    cert = client.post(f"/api/v1/certificates/{reg['id']}/generate").json()
    cid = cert["certificate_id"]

    # Download PDF
    dl_resp = client.get(f"/api/v1/certificates/download/{cid}")
    assert dl_resp.status_code == 200
    assert dl_resp.headers["content-type"] == "application/pdf"
    assert dl_resp.content.startswith(b"%PDF")


def test_valid_certificate_verification(client):
    headers = get_admin_headers(client)
    reg = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "George Verifiable",
        "participant_email": "george.v@example.edu",
        "register_number": "2026CS107"
    }).json()
    client.post("/api/v1/attendance/scan", json={"qr_token": reg["qr_token"]}, headers=headers)
    cert = client.post(f"/api/v1/certificates/{reg['id']}/generate").json()
    cid = cert["certificate_id"]

    # Verify certificate
    v_resp = client.get(f"/api/v1/certificates/verify/{cid}")
    assert v_resp.status_code == 200
    v_data = v_resp.json()

    assert v_data["valid"] is True
    assert v_data["certificate_id"] == cid
    assert v_data["student_name"] == "George Verifiable"
    assert v_data["event_name"] == "Tech Innovators Summit 2026"


def test_invalid_certificate_verification(client):
    v_resp = client.get("/api/v1/certificates/verify/EVIQ-9999-999999")
    assert v_resp.status_code == 200
    v_data = v_resp.json()
    assert v_data["valid"] is False
    assert "not found" in v_data["message"].lower() or "invalid" in v_data["message"].lower()


def test_qr_verification_url_and_data_matching(client):
    headers = get_admin_headers(client)
    reg = client.post("/api/v1/registrations", json={
        "event_id": 1,
        "participant_name": "Hannah Match",
        "participant_email": "hannah.m@example.edu",
        "register_number": "2026CS108"
    }).json()
    client.post("/api/v1/attendance/scan", json={"qr_token": reg["qr_token"]}, headers=headers)
    cert = client.post(f"/api/v1/certificates/{reg['id']}/generate").json()

    # Verification URL in cert response contains certificate_id
    assert f"id={cert['certificate_id']}" in cert["verification_url"]

    # Data matches PostgreSQL registration/event details
    assert cert["registration_id_display"] == f"REG-{reg['id']}"
    assert cert["student_name"] == "Hannah Match"
