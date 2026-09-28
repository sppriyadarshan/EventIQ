"""
EventIQ Transport Planner powered by Google OR-Tools
Optimizes vehicle fleet dispatch to meet predicted participant transit demand while minimizing operating cost.
"""

import math
from typing import Dict, Any, List
from ortools.linear_solver import pywraplp


def run_transport_optimization(
    transport_demand_passengers: int,
    available_fleet: List[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Uses Google OR-Tools Integer Linear Programming (pywraplp) to solve the fleet dispatch problem.
    
    Goal:
    Minimize total vehicle operating cost while ensuring total transport capacity >= passenger demand.
    """
    if available_fleet is None or len(available_fleet) == 0:
        available_fleet = [
            {
                "id": 1,
                "name": "Campus Shuttle Bus (Standard)",
                "type": "BUS",
                "capacity": 75,
                "available_count": 6,
                "operating_cost": 150.0,
            },
            {
                "id": 2,
                "name": "Executive Passenger Van",
                "type": "VAN",
                "capacity": 20,
                "available_count": 4,
                "operating_cost": 60.0,
            }
        ]

    # Initialize OR-Tools MIP solver (CBC or SCIP)
    solver = pywraplp.Solver.CreateSolver("CBC")
    if not solver:
        solver = pywraplp.Solver.CreateSolver("SCIP")
    if not solver:
        # Fallback to GLOP
        solver = pywraplp.Solver.CreateSolver("GLOP")

    if not solver:
        return {
            "status": "INFEASIBLE",
            "message": "OR-Tools solver initialization failed.",
            "vehicles_required": math.ceil(transport_demand_passengers / 75.0),
            "vehicles_selected": 0,
            "total_capacity": 0,
            "unused_capacity": 0,
            "estimated_transport_cost": 0.0,
            "allocations": [],
        }

    # Total available capacity check for feasible constraint setting
    max_capacity = sum(item["capacity"] * item["available_count"] for item in available_fleet)
    
    # Decision Variables: x[i] = number of vehicles of fleet type i dispatched
    vars_map = {}
    for idx, fleet_item in enumerate(available_fleet):
        var_name = f"vehicle_{idx}"
        max_avail = int(fleet_item["available_count"])
        vars_map[idx] = solver.IntVar(0, max_avail, var_name)

    # Deficit slack variable if demand exceeds total fleet capacity
    deficit_var = solver.IntVar(0, max(0, transport_demand_passengers), "capacity_deficit")

    # Constraint: sum(capacity[i] * x[i]) + deficit >= transport_demand_passengers
    capacity_constraint = solver.Constraint(transport_demand_passengers, solver.infinity(), "demand_satisfaction")
    for idx, fleet_item in enumerate(available_fleet):
        capacity_constraint.SetCoefficient(vars_map[idx], float(fleet_item["capacity"]))
    capacity_constraint.SetCoefficient(deficit_var, 1.0)

    # Objective: Minimize total cost + high penalty for any capacity deficit
    objective = solver.Objective()
    for idx, fleet_item in enumerate(available_fleet):
        cost = float(fleet_item["operating_cost"])
        objective.SetCoefficient(vars_map[idx], cost)
    objective.SetCoefficient(deficit_var, 10000.0)  # High penalty for unfulfilled demand
    objective.SetMinimization()

    solver_result = solver.Solve()

    if solver_result == pywraplp.Solver.OPTIMAL:
        status_str = "OPTIMAL"
    elif solver_result == pywraplp.Solver.FEASIBLE:
        status_str = "FEASIBLE"
    else:
        status_str = "INFEASIBLE"

    # Extract optimization solution
    allocated_vehicles = []
    total_capacity = 0
    total_vehicles_selected = 0
    total_cost = 0.0

    for idx, fleet_item in enumerate(available_fleet):
        var_val = int(round(vars_map[idx].solution_value()))
        if var_val > 0:
            item_cap = fleet_item["capacity"] * var_val
            item_cost = fleet_item["operating_cost"] * var_val
            total_vehicles_selected += var_val
            total_capacity += item_cap
            total_cost += item_cost
            allocated_vehicles.append({
                "fleet_name": fleet_item["name"],
                "type": fleet_item["type"],
                "unit_capacity": fleet_item["capacity"],
                "vehicles_selected": var_val,
                "available_count": fleet_item["available_count"],
                "total_provided_capacity": item_cap,
                "cost": item_cost,
            })

    deficit_val = int(round(deficit_var.solution_value()))
    if deficit_val > 0:
        status_str = "INFEASIBLE"

    unused_capacity = max(0, total_capacity - transport_demand_passengers)
    fulfillment_pct = round(min((total_capacity / max(transport_demand_passengers, 1)) * 100, 100.0), 1)

    return {
        "status": status_str,
        "solver_engine": "Google OR-Tools CBC/SCIP Integer Programming",
        "transport_demand_passengers": transport_demand_passengers,
        "vehicles_required": math.ceil(transport_demand_passengers / 75.0),
        "vehicles_selected": total_vehicles_selected,
        "total_capacity": total_capacity,
        "unused_capacity": unused_capacity,
        "fulfillment_pct": fulfillment_pct,
        "estimated_transport_cost": round(total_cost, 2),
        "capacity_deficit": deficit_val,
        "allocations": allocated_vehicles,
    }
