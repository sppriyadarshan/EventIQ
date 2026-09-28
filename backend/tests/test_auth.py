import pytest
from fastapi import status


def get_token_for(client, email, password="EventIQ@123"):
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, f"Login failed for {email}: {response.text}"
    return response.json()["access_token"]


# 1. Admin login succeeds
def test_admin_login_succeeds(client):
    res = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "ADMIN"


# 2. Faculty login succeeds
def test_faculty_login_succeeds(client):
    res = client.post("/api/v1/auth/login", json={"email": "faculty@eventiq.edu", "password": "EventIQ@123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "FACULTY"


# 3. Logistics login succeeds
def test_logistics_login_succeeds(client):
    res = client.post("/api/v1/auth/login", json={"email": "logistics@eventiq.edu", "password": "EventIQ@123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "LOGISTICS"


# 4. Participant login succeeds
def test_participant_login_succeeds(client):
    res = client.post("/api/v1/auth/login", json={"email": "student@eventiq.edu", "password": "EventIQ@123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "PARTICIPANT"


# 5. Wrong password fails
def test_wrong_password_fails(client):
    res = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "WrongPassword123"})
    assert res.status_code == 401
    assert "detail" in res.json()


# 6. Invalid token fails
def test_invalid_token_fails(client):
    res = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid.jwt.token"})
    assert res.status_code == 401


# 7. Admin can access Admin APIs (e.g., /api/v1/optimization/reallocate)
def test_admin_can_access_admin_api(client):
    token = get_token_for(client, "admin@eventiq.edu")
    res = client.post(
        "/api/v1/optimization/reallocate",
        json={"event_id": 1, "new_predicted_attendance": 350},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code in [200, 404]  # Allowed by role guard


# 8. Faculty cannot access Admin APIs
def test_faculty_cannot_access_admin_api(client):
    token = get_token_for(client, "faculty@eventiq.edu")
    res = client.post(
        "/api/v1/optimization/reallocate",
        json={"event_id": 1, "new_predicted_attendance": 350},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 403


# 9. Logistics cannot access Admin-only APIs (/reallocate)
def test_logistics_cannot_access_admin_api(client):
    token = get_token_for(client, "logistics@eventiq.edu")
    res = client.post(
        "/api/v1/optimization/reallocate",
        json={"event_id": 1, "new_predicted_attendance": 350},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 403


# 10. Participant cannot access Admin APIs
def test_participant_cannot_access_admin_api(client):
    token = get_token_for(client, "student@eventiq.edu")
    res = client.post(
        "/api/v1/optimization/reallocate",
        json={"event_id": 1, "new_predicted_attendance": 350},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 403


# 11. Participant can access own registration
def test_participant_can_access_own_registration(client):
    token = get_token_for(client, "student@eventiq.edu")
    # Get own registrations list
    regs = client.get("/api/v1/registrations", headers={"Authorization": f"Bearer {token}"}).json()
    own_reg_id = regs[0]["id"] if (isinstance(regs, list) and len(regs) > 0) else 1

    res = client.get(
        f"/api/v1/registrations/{own_reg_id}/pass",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    assert res.json()["participant_email"].lower() == "student@eventiq.edu"


# 12. Participant cannot access another participant's registration
def test_participant_cannot_access_other_registration(client):
    token = get_token_for(client, "student@eventiq.edu")
    res = client.get(
        "/api/v1/registrations/2/pass",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 403


# 13. Participant can access own certificate
def test_participant_can_access_own_certificate(client):
    token = get_token_for(client, "student@eventiq.edu")
    regs = client.get("/api/v1/registrations", headers={"Authorization": f"Bearer {token}"}).json()
    own_reg_id = regs[0]["id"] if (isinstance(regs, list) and len(regs) > 0) else 1

    res = client.get(
        f"/api/v1/certificates/{own_reg_id}/eligibility",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    assert "eligible" in res.json()


# 14. Participant cannot access another participant's certificate
def test_participant_cannot_access_other_certificate(client):
    token = get_token_for(client, "student@eventiq.edu")
    res = client.get(
        "/api/v1/certificates/2/eligibility",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 403


# 15. Logout/session handling works (GET /me with valid token returns user, without headers fails)
def test_auth_me_session_handling(client):
    token = get_token_for(client, "student@eventiq.edu")
    
    # Valid session
    res1 = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res1.status_code == 200
    assert res1.json()["email"] == "student@eventiq.edu"

    # Cleared session / no header
    res2 = client.get("/api/v1/auth/me")
    assert res2.status_code == 401
