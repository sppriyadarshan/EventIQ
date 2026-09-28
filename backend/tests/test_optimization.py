"""
Backend Unit & Integration Tests for EventIQ Google OR-Tools Optimization Engine.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from optimization.demand import calculate_demand
from optimization.transport import run_transport_optimization
from optimization.equipment import run_equipment_optimization
from optimization.venue import run_venue_optimization

client = TestClient(app)


def test_demand_calculation():
    """Verify explainable demand estimation logic from predicted attendance."""
    res = calculate_demand(predicted_attendance=350, venue_capacity=500, event_type="Conference", duration_hours=4.0)
    
    assert res["predicted_attendance"] == 350
    demands = res["demands"]
    assert demands["chairs"] == 350
    assert demands["transport_passengers"] == 210  # 60% of 350
    assert demands["staff"] == 14  # 350 / 25
    assert demands["catering_kits"] == 350


def test_transport_optimization_optimal():
    """Verify OR-Tools Transport solver minimizes cost for valid fleet capacity."""
    res = run_transport_optimization(
        transport_demand_passengers=200,
        available_fleet=[
            {"id": 1, "name": "Shuttle Bus", "type": "BUS", "capacity": 75, "available_count": 5, "operating_cost": 150.0},
            {"id": 2, "name": "Passenger Van", "type": "VAN", "capacity": 20, "available_count": 4, "operating_cost": 60.0},
        ]
    )
    
    assert res["status"] in ["OPTIMAL", "FEASIBLE"]
    assert res["total_capacity"] >= 200
    assert res["vehicles_selected"] > 0
    assert res["estimated_transport_cost"] > 0


def test_transport_optimization_infeasible():
    """Verify OR-Tools Transport solver flags INFEASIBLE when demand exceeds fleet limit."""
    res = run_transport_optimization(
        transport_demand_passengers=1000,
        available_fleet=[
            {"id": 1, "name": "Shuttle Bus", "type": "BUS", "capacity": 50, "available_count": 2, "operating_cost": 100.0}
        ]
    )
    
    assert res["status"] == "INFEASIBLE"
    assert res["capacity_deficit"] > 0


def test_equipment_optimization_full():
    """Verify OR-Tools Equipment Allocator satisfies inventory demands."""
    demands = {
        "chairs": 100,
        "projectors": 2,
        "sound_systems": 1,
        "microphones": 2,
        "staff": 4,
    }
    res = run_equipment_optimization(demands)
    
    assert res["status"] == "OPTIMAL"
    assert len(res["allocations"]) > 0
    chair_alloc = next((item for item in res["allocations"] if "chair" in item["resource_name"].lower()), None)
    if chair_alloc:
        assert chair_alloc["allocated_quantity"] == 100
        assert chair_alloc["fulfillment_status"] == "FULL"


def test_equipment_optimization_deficit():
    """Verify OR-Tools Equipment Allocator handles inventory deficit gracefully."""
    demands = {"chairs": 1000}
    resources = [
        {"id": 1, "name": "Chairs", "category": "EQUIPMENT", "key": "chairs", "available_quantity": 200, "total_quantity": 300}
    ]
    res = run_equipment_optimization(demands, db_resources=resources)
    
    assert res["status"] == "INFEASIBLE"
    assert res["has_deficit"] is True
    assert res["allocations"][0]["allocated_quantity"] == 200
    assert res["allocations"][0]["fulfillment_status"] == "DEFICIT"


def test_venue_optimization_optimal():
    """Verify OR-Tools Venue Scheduler picks smallest available venue fitting attendance."""
    res = run_venue_optimization(
        predicted_attendance=120,
        candidate_venues=[
            {"id": 1, "name": "Small Lab", "capacity": 50, "available": True},
            {"id": 2, "name": "Tech Hall A", "capacity": 150, "available": True},
            {"id": 3, "name": "Main Auditorium", "capacity": 500, "available": True},
        ]
    )
    
    assert res["status"] == "OPTIMAL"
    assert res["selected_venue_id"] == 2  # Tech Hall A (150 capacity fits 120 with min excess)
    assert res["venue_capacity"] == 150


def test_venue_optimization_infeasible():
    """Verify OR-Tools Venue Scheduler returns INFEASIBLE if no venue fits attendance."""
    res = run_venue_optimization(
        predicted_attendance=1000,
        candidate_venues=[
            {"id": 1, "name": "Hall 1", "capacity": 200, "available": True},
            {"id": 2, "name": "Hall 2", "capacity": 300, "available": True},
        ]
    )
    
    assert res["status"] == "INFEASIBLE"
    assert "exceeds maximum available venue capacity" in res["message"]


def get_admin_headers(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@eventiq.edu", "password": "EventIQ@123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_optimization_api_endpoint(client):
    """Verify POST /api/v1/optimization/plan executes end-to-end OR-Tools pipeline."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/plan", json={"event_id": 1}, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == 1
    assert "predicted_attendance" in data
    assert "transport" in data
    assert "equipment" in data
    assert "venue" in data
    assert data["transport"]["status"] in ["OPTIMAL", "FEASIBLE", "INFEASIBLE"]
    assert data["venue"]["status"] in ["OPTIMAL", "FEASIBLE", "INFEASIBLE"]


def test_lightgbm_to_ortools_pipeline(client):
    """Verify LightGBM turnout prediction output feeds directly into OR-Tools demand."""
    headers = get_admin_headers(client)
    response = client.post("/api/v1/optimization/plan", json={"event_id": 1}, headers=headers)
    data = response.json()
    
    pred_att = data["predicted_attendance"]
    venue_cap = data["venue"]["venue_capacity"]
    
    assert pred_att > 0
    # Confirm venue capacity constraint checked against LightGBM predicted attendance
    assert venue_cap >= pred_att or data["venue"]["status"] == "INFEASIBLE"

