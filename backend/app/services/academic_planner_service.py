"""
EventIQ Academic Planner & Solver Service
Enforces Academic Timetable & Calendar constraints on EventIQ OR-Tools solver.
Prevents event scheduling during mandatory department classes, lab sessions, or exam blocks.
Suggests optimal alternative slots and venues when conflicts are detected.
"""

from datetime import datetime, date, time
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from ortools.linear_solver import pywraplp

from app.models.event import Event, Venue
from app.models.institution import Department
from app.models.academic_schedule import AcademicSchedule


def parse_time_str(t_val) -> time:
    if isinstance(t_val, time):
        return t_val
    if isinstance(t_val, str):
        t_str = t_val.strip()
        for fmt in ["%H:%M:%S", "%H:%M", "%I:%M %p"]:
            try:
                return datetime.strptime(t_str, fmt).time()
            except ValueError:
                pass
    return time(10, 0)


def times_overlap(start1: time, end1: time, start2: time, end2: time) -> bool:
    """Returns True if [start1, end1] overlaps with [start2, end2]."""
    return not (end1 <= start2 or start1 >= end2)


def get_day_name(date_obj: Optional[date] = None, day_str: Optional[str] = None) -> str:
    if day_str and day_str.strip():
        return day_str.strip().capitalize()
    if date_obj:
        return date_obj.strftime("%A")
    return "Monday"


def check_academic_conflict(
    db: Session,
    department_code: str = "CSE",
    date_val: Optional[date] = None,
    day_of_week: Optional[str] = "Monday",
    start_time_str: str = "10:00",
    end_time_str: str = "12:00",
    venue_id: Optional[int] = None,
    event_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    Evaluates whether an event conflicts with the academic schedule in PostgreSQL:
    1. Department class/exam schedule conflict.
    2. Venue occupied by academic class/lab.
    3. Mandatory academic blockouts.
    """
    start_t = parse_time_str(start_time_str)
    end_t = parse_time_str(end_time_str)
    target_day = get_day_name(date_val, day_of_week)

    dept_code = department_code.strip().upper() if department_code else "CSE"

    # Fetch academic schedules for target day/date
    if date_val is not None:
        schedules = db.query(AcademicSchedule).filter(
            (AcademicSchedule.day_of_week == target_day) | (AcademicSchedule.schedule_date == date_val)
        ).all()
    else:
        schedules = db.query(AcademicSchedule).filter(
            AcademicSchedule.day_of_week == target_day
        ).all()

    conflict_reasons = []

    for sched in schedules:
        if not times_overlap(start_t, end_t, sched.start_time, sched.end_time):
            continue

        # Check Department class conflict
        if sched.department_code.upper() == dept_code and (sched.is_mandatory or sched.is_blocked):
            conflict_reasons.append(
                f"Department {dept_code} has mandatory class/activity '{sched.subject_activity}' "
                f"on {target_day} from {sched.start_time.strftime('%H:%M')} to {sched.end_time.strftime('%H:%M')}."
            )

        # Check Venue occupancy conflict
        if venue_id and sched.venue_id == venue_id:
            venue_obj = db.query(Venue).filter(Venue.id == venue_id).first()
            v_name = venue_obj.name if venue_obj else f"Venue #{venue_id}"
            conflict_reasons.append(
                f"Venue '{v_name}' is occupied by academic session '{sched.subject_activity}' "
                f"on {target_day} from {sched.start_time.strftime('%H:%M')} to {sched.end_time.strftime('%H:%M')}."
            )

    has_conflict = len(conflict_reasons) > 0
    status = "CONFLICT_DETECTED" if has_conflict else "AVAILABLE"

    # Find Alternative Time Slots & Alternative Venues
    alternative_slots = []
    candidate_times = [
        ("08:00", "10:00"),
        ("10:00", "12:00"),
        ("12:00", "14:00"),
        ("14:00", "16:00"),
        ("16:00", "18:00")
    ]
    candidate_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    for d in candidate_days:
        for st_str, et_str in candidate_times:
            if d == target_day and st_str == start_time_str and has_conflict:
                continue

            c_st = parse_time_str(st_str)
            c_et = parse_time_str(et_str)

            # Check if this candidate slot is conflict-free
            slot_conflict = False
            for sched in schedules:
                if (sched.day_of_week == d or sched.schedule_date == date_val) and times_overlap(c_st, c_et, sched.start_time, sched.end_time):
                    if sched.department_code.upper() == dept_code and (sched.is_mandatory or sched.is_blocked):
                        slot_conflict = True
                        break

            if not slot_conflict:
                alternative_slots.append({
                    "day": d,
                    "start_time": st_str,
                    "end_time": et_str,
                    "status": "AVAILABLE"
                })
                if len(alternative_slots) >= 3:
                    break
        if len(alternative_slots) >= 3:
            break

    # Alternative Venues if venue conflict occurred
    alternative_venues = []
    all_venues = db.query(Venue).filter(Venue.available == True).all()
    for v in all_venues:
        if v.id == venue_id and has_conflict:
            continue
        v_occupied = False
        for sched in schedules:
            if sched.venue_id == v.id and times_overlap(start_t, end_t, sched.start_time, sched.end_time):
                v_occupied = True
                break
        if not v_occupied:
            alternative_venues.append({
                "venue_id": v.id,
                "venue_name": v.name,
                "capacity": v.capacity,
                "venue_type": v.venue_type,
                "status": "AVAILABLE"
            })
            if len(alternative_venues) >= 3:
                break

    message = (
        "Academic schedule conflict detected! Department or venue is occupied."
        if has_conflict
        else "No academic schedule conflicts. Time slot and venue are available for allocation."
    )

    return {
        "has_conflict": has_conflict,
        "status": status,
        "message": message,
        "conflict_reasons": conflict_reasons,
        "alternative_slots": alternative_slots,
        "alternative_venues": alternative_venues
    }


def solve_academic_ortools_optimization(
    db: Session,
    event_id: int,
    requested_day: str = "Monday",
    requested_start_time: str = "10:00",
    requested_end_time: str = "12:00",
    requested_venue_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    Formulates Google OR-Tools Integer Programming model incorporating Academic Timetable constraints.
    Returns optimal venue & time slot selection that obeys academic class non-interference rules.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise ValueError(f"Event with ID {event_id} not found.")

    institution_id = event.institution_id
    dept_code = "CSE"
    if event.department_id:
        dept = db.query(Department).filter(Department.id == event.department_id).first()
        if dept:
            dept_code = dept.code

    predicted_attendance = event.expected_participants or 200

    # Fetch candidate venues
    venues = db.query(Venue).filter(Venue.institution_id == institution_id, Venue.available == True).all()

    # Time slots candidate matrix
    candidate_slots = [
        {"day": "Monday", "start": "09:00", "end": "11:00", "slot_id": 1},
        {"day": "Monday", "start": "11:00", "end": "13:00", "slot_id": 2},
        {"day": "Monday", "start": "14:00", "end": "16:00", "slot_id": 3},
        {"day": "Tuesday", "start": "10:00", "end": "12:00", "slot_id": 4},
        {"day": "Tuesday", "start": "14:00", "end": "16:00", "slot_id": 5},
        {"day": "Wednesday", "start": "10:00", "end": "12:00", "slot_id": 6},
    ]

    # Fetch all academic schedule entries
    schedules = db.query(AcademicSchedule).filter(AcademicSchedule.institution_id == institution_id).all()

    # Build feasibility matrix for (venue, slot) pairs
    feasible_combinations = []
    rejection_reasons = []

    for v in venues:
        for slot in candidate_slots:
            st = parse_time_str(slot["start"])
            et = parse_time_str(slot["end"])

            # Check capacity
            if v.capacity < predicted_attendance:
                rejection_reasons.append(f"Venue '{v.name}' (Cap: {v.capacity}) < predicted attendance ({predicted_attendance})")
                continue

            # Check academic conflict
            conflict = False
            c_msg = ""
            for sched in schedules:
                if sched.day_of_week == slot["day"] and times_overlap(st, et, sched.start_time, sched.end_time):
                    if sched.department_code.upper() == dept_code.upper() and (sched.is_mandatory or sched.is_blocked):
                        conflict = True
                        c_msg = f"Department class '{sched.subject_activity}' on {slot['day']} at {slot['start']}"
                        break
                    if sched.venue_id == v.id:
                        conflict = True
                        c_msg = f"Venue '{v.name}' occupied by class '{sched.subject_activity}' on {slot['day']} at {slot['start']}"
                        break

            if not conflict:
                feasible_combinations.append({
                    "venue": v,
                    "slot": slot
                })
            else:
                rejection_reasons.append(f"Slot {slot['day']} {slot['start']} at {v.name} rejected: {c_msg}")

    if not feasible_combinations:
        # Fallback if no slot/venue satisfies all strict constraints
        best_venue = venues[0] if venues else None
        return {
            "status": "INFEASIBLE",
            "message": "No feasible venue/slot combination found without academic schedule conflict.",
            "selected_venue": best_venue.name if best_venue else "None",
            "selected_slot": f"{requested_day} {requested_start_time}-{requested_end_time}",
            "is_conflict_free": False,
            "explanation": "All candidate slots and venues have department class conflicts or capacity deficits.",
            "conflict_reasons": list(set(rejection_reasons[:5])),
            "alternative_slots": [],
            "alternative_venues": []
        }

    # Solve using Google OR-Tools PyWrapLP
    solver = pywraplp.Solver.CreateSolver("CBC")
    if not solver:
        solver = pywraplp.Solver.CreateSolver("GLOP")

    x_vars = {}
    for idx, combo in enumerate(feasible_combinations):
        x_vars[idx] = solver.IntVar(0, 1, f"x_{idx}")

    # Exactly 1 combination selected
    select_one = solver.Constraint(1.0, 1.0, "select_one_combination")
    for idx in range(len(feasible_combinations)):
        select_one.SetCoefficient(x_vars[idx], 1.0)

    # Objective Function: Minimize capacity waste + preference penalty
    objective = solver.Objective()
    for idx, combo in enumerate(feasible_combinations):
        v = combo["venue"]
        slot = combo["slot"]
        wasted_cap = v.capacity - predicted_attendance
        pref_penalty = 0.0
        if slot["day"] == requested_day and slot["start"] == requested_start_time:
            pref_penalty -= 50.0  # Bonus for requested time
        if requested_venue_id and v.id == requested_venue_id:
            pref_penalty -= 30.0  # Bonus for requested venue

        cost = wasted_cap + pref_penalty
        objective.SetCoefficient(x_vars[idx], float(cost))

    objective.SetMinimization()
    solver.Solve()

    selected_idx = 0
    for idx in range(len(feasible_combinations)):
        if int(round(x_vars[idx].solution_value())) == 1:
            selected_idx = idx
            break

    winner = feasible_combinations[selected_idx]
    win_v = winner["venue"]
    win_s = winner["slot"]

    return {
        "status": "OPTIMAL",
        "solver_engine": "Google OR-Tools Academic Integer Programming Solver",
        "event_id": event.id,
        "event_title": event.title,
        "department_code": dept_code,
        "predicted_attendance": predicted_attendance,
        "selected_venue_id": win_v.id,
        "selected_venue_name": win_v.name,
        "venue_capacity": win_v.capacity,
        "selected_slot": {
            "day": win_s["day"],
            "start_time": win_s["start"],
            "end_time": win_s["end"]
        },
        "is_conflict_free": True,
        "explanation": f"Selected '{win_v.name}' (Cap: {win_v.capacity}) on {win_s['day']} ({win_s['start']}-{win_s['end']}) which is 100% free of academic department class conflicts.",
        "evaluated_combinations_count": len(feasible_combinations),
        "rejection_summary": list(set(rejection_reasons[:4]))
    }
