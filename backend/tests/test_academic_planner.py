"""
Unit tests for EventIQ Academic Planner & Solver:
1. All 10 department conflict slots
2. All 10 department non-conflict slots
3. Partial time overlap test
4. Exact boundary test
5. Venue conflict test
6. Department conflict test
7. Duplicate seed prevention test
8. OR-Tools alternative allocation test
"""

import pytest
from app.models.institution import Department
from app.models.event import Venue, Event
from app.models.academic_schedule import AcademicSchedule

# Deterministic Conflict Scenarios for all 10 departments
CONFLICT_SCENARIOS = [
    ("CSE", "Monday", "09:00", "11:00", 1),
    ("ECE", "Tuesday", "10:30", "12:30", 1),
    ("MECH", "Wednesday", "13:00", "15:00", 2),
    ("CIVIL", "Thursday", "09:30", "11:30", 3),
    ("AIDS", "Friday", "11:00", "13:00", 9),
    ("AIML", "Monday", "14:00", "16:00", 9),
    ("CSBS", "Tuesday", "13:30", "15:30", 2),
    ("EEE", "Wednesday", "10:00", "12:00", 2),
    ("IT", "Thursday", "14:00", "16:00", 3),
    ("ICE", "Friday", "09:00", "11:00", 3),
]

# Non-Conflict Scenarios for all 10 departments (using unoccupied Multipurpose Hall #15)
NON_CONFLICT_SCENARIOS = [
    ("CSE", "Monday", "14:00", "16:00", 15),
    ("ECE", "Tuesday", "14:00", "16:00", 15),
    ("MECH", "Wednesday", "09:00", "11:00", 15),
    ("CIVIL", "Thursday", "14:00", "16:00", 15),
    ("AIDS", "Friday", "14:00", "16:00", 15),
    ("AIML", "Monday", "09:00", "11:00", 15),
    ("CSBS", "Tuesday", "09:00", "11:00", 15),
    ("EEE", "Wednesday", "14:00", "16:00", 15),
    ("IT", "Thursday", "09:00", "11:00", 15),
    ("ICE", "Friday", "14:00", "16:00", 15),
]


@pytest.mark.parametrize("dept, day, start, end, venue_id", CONFLICT_SCENARIOS)
def test_department_conflict_slots(client, dept, day, start, end, venue_id):
    """Test conflict detection for all 10 departments on their exact academic schedule slot."""
    resp = client.post("/api/v1/academic-schedule/check-conflict", json={
        "department_code": dept,
        "day_of_week": day,
        "start_time": start,
        "end_time": end,
        "venue_id": venue_id
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["has_conflict"] is True
    assert data["status"] == "CONFLICT_DETECTED"
    assert any(dept in reason for reason in data["conflict_reasons"])


@pytest.mark.parametrize("dept, day, start, end, venue_id", NON_CONFLICT_SCENARIOS)
def test_department_non_conflict_slots(client, dept, day, start, end, venue_id):
    """Test non-conflict evaluation for all 10 departments on free time slots."""
    resp = client.post("/api/v1/academic-schedule/check-conflict", json={
        "department_code": dept,
        "day_of_week": day,
        "start_time": start,
        "end_time": end,
        "venue_id": venue_id
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["has_conflict"] is False
    assert data["status"] == "AVAILABLE"
    assert len(data["conflict_reasons"]) == 0


def test_partial_time_overlap(client):
    """CSE class is Monday 09:00-11:00. Proposed slot 10:00-12:00 partially overlaps -> CONFLICT."""
    resp = client.post("/api/v1/academic-schedule/check-conflict", json={
        "department_code": "CSE",
        "day_of_week": "Monday",
        "start_time": "10:00",
        "end_time": "12:00",
        "venue_id": 1
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["has_conflict"] is True
    assert data["status"] == "CONFLICT_DETECTED"


def test_exact_time_boundary(client):
    """CSE class is Monday 09:00-11:00. Proposed slot 11:00-13:00 starts right at 11:00 -> NO CONFLICT."""
    resp = client.post("/api/v1/academic-schedule/check-conflict", json={
        "department_code": "CSE",
        "day_of_week": "Monday",
        "start_time": "11:00",
        "end_time": "13:00",
        "venue_id": 15
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["has_conflict"] is False
    assert data["status"] == "AVAILABLE"


def test_venue_occupation_conflict(client):
    """Venue #1 is occupied on Monday 09:00-11:00 by CSE class. Checking ECE for Venue #1 -> CONFLICT."""
    resp = client.post("/api/v1/academic-schedule/check-conflict", json={
        "department_code": "ECE",
        "day_of_week": "Monday",
        "start_time": "09:00",
        "end_time": "11:00",
        "venue_id": 1  # Occupied venue
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["has_conflict"] is True
    assert data["status"] == "CONFLICT_DETECTED"
    assert any("occupied" in reason.lower() for reason in data["conflict_reasons"])


def test_ortools_alternative_allocation(client):
    """Run OR-Tools optimization when requesting Monday 09:00-11:00 for CSE (conflict). Solver picks free slot/venue."""
    resp = client.post("/api/v1/academic-schedule/optimize", json={
        "event_id": 1,
        "department_code": "CSE",
        "day_of_week": "Monday",
        "start_time": "09:00",
        "end_time": "11:00",
        "venue_id": 1
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "OPTIMAL"
    assert data["is_conflict_free"] is True
    assert not (data["selected_slot"]["day"] == "Monday" and data["selected_slot"]["start_time"] == "09:00")


def test_duplicate_seed_prevention(db_session):
    """Verifies that academic schedule entries in db_session maintain unique department-day-time tuples."""
    schedules = db_session.query(AcademicSchedule).all()
    dept_day_tuples = [(s.department_code, s.day_of_week, s.start_time.strftime("%H:%M")) for s in schedules]
    assert len(dept_day_tuples) == len(set(dept_day_tuples))

