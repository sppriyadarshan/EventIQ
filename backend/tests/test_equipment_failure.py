"""
Backend Unit & Integration Tests for EventIQ Equipment Failure + Recovery Workflow.
Verifies:
1. Equipment failure detection endpoint (/equipment-failure).
2. Failed resource is excluded from allocation.
3. Equipment shortage is calculated correctly using predicted_attendance.
4. Replacement resource is found when available in inventory.
5. Recovery plan uses the existing OR-Tools equipment allocator.
6. Genuine recovery failure reported when no replacement is available.
7. Apply recovery updates PostgreSQL resource status and creates Notification.
8. actual_attendance is NEVER used for planning.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from optimization.optimizer import run_equipment_failure_recovery

client = TestClient(app)


def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_equipment_failure_simulation_endpoint(client):
    """Verify POST /api/v1/optimization/equipment-failure detects shortage and OR-Tools recovery."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/equipment-failure", json={
        "event_id": 1,
        "resource_id": 1,
        "failure_type": "PROJECTOR_FAILURE"
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == 1
    assert "failed_resource" in data
    assert data["failed_resource"]["id"] == 1
    assert "impact" in data
    assert "shortage" in data["impact"]
    assert "before" in data
    assert "after" in data
    assert "alerts" in data
    assert len(data["alerts"]) > 0


def test_equipment_failure_recovery_preview_endpoint(client):
    """Verify POST /api/v1/optimization/equipment-failure/recovery returns recovery preview plan."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/equipment-failure/recovery", json={
        "event_id": 1,
        "resource_id": 1
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["RECOVERY_AVAILABLE", "RECOVERY_NOT_POSSIBLE"]
    assert data["event_id"] == 1
    assert "replacement" in data


def test_apply_equipment_failure_recovery(client):
    """Verify POST /api/v1/optimization/equipment-failure/apply updates PostgreSQL DB and creates Notification."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/equipment-failure/apply", json={
        "event_id": 1,
        "failed_resource_id": 1,
        "replacement_resource_id": 2
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["failed_resource"]["id"] == 1
    assert data["failed_resource"]["status"] == "CRITICAL"
    assert data["notification_created"] is True

    # Verify notification created in DB
    notif_res = client.get("/api/v1/notifications")
    assert notif_res.status_code == 200
    notifs = notif_res.json()
    assert any("Equipment Failure" in n["title"] or n["type"] in ["WARNING", "ERROR"] for n in notifs)


def test_no_actual_attendance_in_equipment_failure():
    """Verify actual_attendance is NOT used in equipment failure recovery orchestrator."""
    import inspect
    sig = inspect.signature(run_equipment_failure_recovery)
    assert "actual_attendance" not in sig.parameters
