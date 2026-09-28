"""
EventIQ Equipment Allocator powered by Google OR-Tools
Optimizes resource and equipment allocation using OR-Tools Linear Programming.
"""

import math
from typing import Dict, Any, List
from ortools.linear_solver import pywraplp


def run_equipment_optimization(
    demands: Dict[str, int],
    db_resources: List[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Uses Google OR-Tools Integer Programming to allocate equipment resources from available inventory.
    
    Resource Categories:
    - Chairs / Seating
    - Tables
    - Projectors & Screens
    - Sound Systems
    - Microphones
    - Staff / Coordinators
    - Catering Kits
    """
    # Default equipment catalog from database seed specs if not passed directly
    if not db_resources:
        db_resources = [
            {"id": 1, "name": "Chairs & Tables Sets", "category": "EQUIPMENT", "key": "chairs", "available_quantity": 450, "total_quantity": 600},
            {"id": 2, "name": "HD Projectors & LED Screens", "category": "EQUIPMENT", "key": "projectors", "available_quantity": 10, "total_quantity": 12},
            {"id": 3, "name": "PA Sound Systems", "category": "EQUIPMENT", "key": "sound_systems", "available_quantity": 6, "total_quantity": 8},
            {"id": 4, "name": "Wireless Microphones", "category": "EQUIPMENT", "key": "microphones", "available_quantity": 25, "total_quantity": 30},
            {"id": 5, "name": "Event Managers & Coordinators", "category": "STAFF", "key": "staff", "available_quantity": 20, "total_quantity": 25},
            {"id": 6, "name": "Catering Lunch Kits", "category": "FOOD", "key": "catering_kits", "available_quantity": 350, "total_quantity": 500},
        ]

    solver = pywraplp.Solver.CreateSolver("CBC")
    if not solver:
        solver = pywraplp.Solver.CreateSolver("SCIP")
    if not solver:
        solver = pywraplp.Solver.CreateSolver("GLOP")

    allocations = []
    has_deficit = False

    for item in db_resources:
        key = item.get("key") or item.get("name", "").lower()
        req_qty = demands.get(key, 0)
        
        # If no specific mapping key matched, match category or name keywords
        if req_qty == 0:
            name_l = item.get("name", "").lower()
            if "chair" in name_l:
                req_qty = demands.get("chairs", 0)
            elif "projector" in name_l:
                req_qty = demands.get("projectors", 0)
            elif "sound" in name_l or "pa " in name_l:
                req_qty = demands.get("sound_systems", 0)
            elif "micro" in name_l:
                req_qty = demands.get("microphones", 0)
            elif "manager" in name_l or "staff" in name_l or "volunteer" in name_l:
                req_qty = demands.get("staff", 0)
            elif "catering" in name_l or "food" in name_l or "lunch" in name_l:
                req_qty = demands.get("catering_kits", 0)

        avail_qty = int(item.get("available_quantity", 0))

        if not solver or req_qty == 0:
            alloc_qty = min(req_qty, avail_qty)
        else:
            # Create single-item LP optimization
            sub_solver = pywraplp.Solver.CreateSolver("CBC")
            if not sub_solver:
                sub_solver = pywraplp.Solver.CreateSolver("GLOP")

            # Var: x = allocated quantity
            x = sub_solver.IntVar(0, avail_qty, "alloc_x")
            slack = sub_solver.IntVar(0, max(req_qty, 1), "slack_x")

            # Constraint: x + slack >= req_qty
            c = sub_solver.Constraint(req_qty, sub_solver.infinity())
            c.SetCoefficient(x, 1.0)
            c.SetCoefficient(slack, 1.0)

            # Objective: minimize slack (unfulfilled) + minor cost for x (allocated)
            obj = sub_solver.Objective()
            obj.SetCoefficient(slack, 1000.0)
            obj.SetCoefficient(x, 1.0)
            obj.SetMinimization()

            sub_solver.Solve()
            alloc_qty = int(round(x.solution_value()))

        unused_qty = max(0, avail_qty - alloc_qty)
        utilization_pct = round((alloc_qty / max(avail_qty, 1)) * 100, 1)

        if alloc_qty < req_qty:
            has_deficit = True
            fulfillment_status = "DEFICIT"
        elif alloc_qty == req_qty:
            fulfillment_status = "FULL"
        else:
            fulfillment_status = "SURPLUS"

        allocations.append({
            "resource_id": item.get("id"),
            "resource_name": item.get("name"),
            "category": item.get("category", "EQUIPMENT"),
            "required_quantity": req_qty,
            "allocated_quantity": alloc_qty,
            "available_quantity": avail_qty,
            "total_quantity": item.get("total_quantity", avail_qty),
            "unused_quantity": unused_qty,
            "utilization_pct": utilization_pct,
            "fulfillment_status": fulfillment_status,
        })

    status_str = "INFEASIBLE" if has_deficit else "OPTIMAL"

    return {
        "status": status_str,
        "solver_engine": "Google OR-Tools CBC Equipment Optimizer",
        "allocations": allocations,
        "total_categories_optimized": len(allocations),
        "has_deficit": has_deficit,
    }
