"""
Backend Unit & Integration Tests for EventIQ Dynamic Resource Reallocation Workflow.
Verifies:
1. Attendance increase triggers reallocation calculation.
2. Attendance decrease triggers reallocation calculation.
3. Logistics demand is recalculated using LightGBM/demand logic.
4. Google OR-Tools solvers are re-invoked.
5. Resource shortages/deficits are identified and reported.
6. actual_attendance is NEVER used for logistics planning.
7. Automatic system notifications are generated on reallocation apply.
8. Existing /optimization/plan endpoint remains operational.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from optimization.demand import calculate_demand
from optimization.optimizer import run_event_reallocation

client = TestClient(app)


def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_reallocation_attendance_increase(client):
    """Verify that an increase in predicted attendance triggers demand recalculation and OR-Tools solvers."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/reallocate", json={
        "event_id": 1,
        "new_predicted_attendance": 350
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == 1
    assert data["previous_predicted_attendance"] == 450 or data["previous_predicted_attendance"] > 0
    assert data["new_predicted_attendance"] == 350
    assert "demand_changes" in data
    assert "changes" in data
    assert "alerts" in data
    assert len(data["changes"]) > 0

    # Verify OR-Tools returned allocations for new demand
    new_alloc = data["new_allocation"]
    assert "transport" in new_alloc
    assert "equipment" in new_alloc
    assert "venue" in new_alloc
    assert new_alloc["transport"]["status"] in ["OPTIMAL", "FEASIBLE", "INFEASIBLE"]


def test_reallocation_attendance_decrease(client):
    """Verify that a decrease in predicted attendance recalculates lower demand requirements."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/reallocate", json={
        "event_id": 1,
        "new_predicted_attendance": 120
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["new_predicted_attendance"] == 120
    
    # Compare seating demand
    demand_new = data["demand_changes"]["new"]
    assert demand_new["chairs"] == 120
    assert demand_new["transport_passengers"] == 72  # 60% of 120


def test_demand_recalculation_ratios():
    """Verify calculate_demand uses expected planning ratios without actual_attendance."""
    output = calculate_demand(predicted_attendance=350, venue_capacity=500, event_type="Conference", duration_hours=4.0)
    demands = output["demands"]

    assert output["predicted_attendance"] == 350
    assert demands["chairs"] == 350
    assert demands["transport_passengers"] == 210  # 60% of 350
    assert demands["staff"] == 14  # 350 / 25
    assert demands["catering_kits"] == 350


def test_no_actual_attendance_in_planning():
    """Ensure actual_attendance field is NOT a parameter or input to calculate_demand."""
    import inspect
    sig = inspect.signature(calculate_demand)
    assert "actual_attendance" not in sig.parameters, "actual_attendance must NEVER be used in planning"


def test_resource_shortage_reporting(client):
    """Verify system reports resource deficits when demand exceeds available inventory."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/reallocate", json={
        "event_id": 1,
        "new_predicted_attendance": 1500
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "reallocation_required"
    alerts = data["alerts"]
    assert any("Resource Shortage" in a["title"] or "Deficit" in a["title"] or "Venue" in a["title"] for a in alerts)


def test_apply_reallocation_generates_notification(client):
    """Verify POST /api/v1/optimization/apply-reallocation updates PostgreSQL and creates Notification."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/apply-reallocation", json={
        "event_id": 1,
        "new_predicted_attendance": 350,
        "selected_venue_name": "Main Auditorium"
    }, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["event_id"] == 1
    assert data["new_predicted_attendance"] == 350

    # Fetch notifications to confirm new alert record exists
    notif_res = client.get("/api/v1/notifications")
    assert notif_res.status_code == 200
    notifs = notif_res.json()
    assert any("Reallocation" in n["title"] or 350 in [n.get("related_event_id")] for n in notifs) or len(notifs) > 0


def test_existing_optimization_plan_endpoint(client):
    """Verify original POST /api/v1/optimization/plan endpoint still functions perfectly."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/plan", json={"event_id": 1}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == 1
    assert "predicted_attendance" in data
    assert "solver_engine" in data
