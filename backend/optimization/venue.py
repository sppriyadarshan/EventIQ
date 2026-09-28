"""
EventIQ Venue Scheduler powered by Google OR-Tools
Selects optimal venue from candidate venues where capacity >= predicted attendance.
"""

from typing import Dict, Any, List
from ortools.linear_solver import pywraplp


def run_venue_optimization(
    predicted_attendance: int,
    current_venue_id: int = None,
    candidate_venues: List[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Uses Google OR-Tools Binary Integer Programming to assign the optimal venue.
    
    Constraint:
    venue.capacity >= predicted_attendance
    
    Objective:
    Minimize excess wasted capacity while preferring available venues.
    """
    if candidate_venues is None or len(candidate_venues) == 0:
        candidate_venues = [
            {"id": 1, "name": "Main Auditorium", "location": "Block A, Floor 1", "capacity": 500, "venue_type": "Auditorium", "available": True},
            {"id": 2, "name": "Tech Hall A", "location": "Block B, Floor 2", "capacity": 150, "venue_type": "Lecture Hall", "available": True},
            {"id": 3, "name": "Seminar Hall B", "location": "Block C, Floor 3", "capacity": 100, "venue_type": "Seminar Hall", "available": True},
            {"id": 4, "name": "Open Air Theatre", "location": "Campus Grounds", "capacity": 800, "venue_type": "Outdoor", "available": True},
            {"id": 5, "name": "Innovation Lab", "location": "Block D, Floor 1", "capacity": 80, "venue_type": "Lab", "available": True},
        ]

    # Filter available candidate venues
    avail_venues = [v for v in candidate_venues if v.get("available", True)]
    
    if not avail_venues:
        return {
            "status": "INFEASIBLE",
            "message": "No available venues found in database.",
            "selected_venue_id": current_venue_id,
            "selected_venue_name": "None",
            "venue_capacity": 0,
            "predicted_attendance": predicted_attendance,
            "utilization_pct": 0.0,
            "excess_capacity": 0,
            "location": "",
            "venue_type": "",
            "is_reassigned": False,
        }

    # Find feasible venues where capacity >= predicted_attendance
    feasible_venues = [v for v in avail_venues if v.get("capacity", 0) >= predicted_attendance]

    if not feasible_venues:
        # None of the venues can fit predicted attendance!
        best_avail = max(avail_venues, key=lambda v: v.get("capacity", 0))
        return {
            "status": "INFEASIBLE",
            "message": f"Predicted attendance of {predicted_attendance} exceeds maximum available venue capacity ({best_avail.get('capacity')}).",
            "selected_venue_id": best_avail.get("id"),
            "selected_venue_name": best_avail.get("name"),
            "venue_capacity": best_avail.get("capacity", 0),
            "predicted_attendance": predicted_attendance,
            "utilization_pct": round((predicted_attendance / max(best_avail.get("capacity", 1), 1)) * 100, 1),
            "excess_capacity": best_avail.get("capacity", 0) - predicted_attendance,
            "location": best_avail.get("location", ""),
            "venue_type": best_avail.get("venue_type", ""),
            "is_reassigned": best_avail.get("id") != current_venue_id,
        }

    # OR-Tools Binary IP Formulation
    solver = pywraplp.Solver.CreateSolver("CBC")
    if not solver:
        solver = pywraplp.Solver.CreateSolver("GLOP")

    # Decision variables: y[i] in {0, 1}
    y_vars = {}
    for idx, venue in enumerate(feasible_venues):
        y_vars[idx] = solver.IntVar(0, 1, f"venue_choice_{idx}")

    # Constraint: sum(y[i]) == 1 (Select exactly 1 venue)
    select_one = solver.Constraint(1.0, 1.0, "select_exactly_one_venue")
    for idx in range(len(feasible_venues)):
        select_one.SetCoefficient(y_vars[idx], 1.0)

    # Objective: Minimize excess capacity = sum(y[i] * (capacity[i] - predicted_attendance))
    # Give slight preference bonus if venue is already current_venue_id
    objective = solver.Objective()
    for idx, venue in enumerate(feasible_venues):
        excess = venue.get("capacity", 0) - predicted_attendance
        pref_bonus = -5.0 if venue.get("id") == current_venue_id else 0.0
        objective.SetCoefficient(y_vars[idx], float(excess + pref_bonus))
    objective.SetMinimization()

    solver.Solve()

    # Find selected venue index
    selected_idx = 0
    for idx in range(len(feasible_venues)):
        if int(round(y_vars[idx].solution_value())) == 1:
            selected_idx = idx
            break

    sel_venue = feasible_venues[selected_idx]
    cap = sel_venue.get("capacity", 100)
    utilization_pct = round((predicted_attendance / max(cap, 1)) * 100, 1)
    excess_capacity = cap - predicted_attendance

    return {
        "status": "OPTIMAL",
        "solver_engine": "Google OR-Tools Binary Integer Programming",
        "selected_venue_id": sel_venue.get("id"),
        "selected_venue_name": sel_venue.get("name"),
        "venue_capacity": cap,
        "predicted_attendance": predicted_attendance,
        "utilization_pct": utilization_pct,
        "excess_capacity": excess_capacity,
        "location": sel_venue.get("location", ""),
        "venue_type": sel_venue.get("venue_type", ""),
        "is_reassigned": sel_venue.get("id") != current_venue_id,
        "candidate_venues_evaluated": len(candidate_venues),
    }
