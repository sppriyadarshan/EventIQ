from typing import List, Optional
from datetime import datetime, time
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.academic_schedule import AcademicSchedule
from app.models.event import Event, Venue
from app.schemas.academic_schedule import (
    AcademicScheduleCreate,
    AcademicScheduleOut,
    AcademicCheckConflictRequest,
    AcademicCheckConflictResponse
)
from app.services.academic_planner_service import check_academic_conflict, solve_academic_ortools_optimization

router = APIRouter(prefix="/academic-schedule", tags=["Academic Schedule"])


@router.get("", response_model=List[AcademicScheduleOut])
def get_academic_schedules(
    department_code: Optional[str] = None,
    day_of_week: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AcademicSchedule)
    if department_code:
        query = query.filter(AcademicSchedule.department_code == department_code.strip().upper())
    if day_of_week:
        query = query.filter(AcademicSchedule.day_of_week == day_of_week.strip().capitalize())
    return query.all()


@router.post("", response_model=AcademicScheduleOut, status_code=status.HTTP_201_CREATED)
def create_academic_schedule(
    payload: AcademicScheduleCreate,
    db: Session = Depends(get_db)
):
    sched = AcademicSchedule(**payload.model_dump())
    db.add(sched)
    db.commit()
    db.refresh(sched)
    return sched


@router.post("/check-conflict", response_model=AcademicCheckConflictResponse)
def check_conflict(
    payload: AcademicCheckConflictRequest,
    db: Session = Depends(get_db)
):
    """
    Evaluates proposed event date/time/venue against academic schedule constraints in PostgreSQL.
    """
    res = check_academic_conflict(
        db=db,
        department_code=payload.department_code,
        day_of_week=payload.day_of_week,
        start_time_str=payload.start_time,
        end_time_str=payload.end_time,
        venue_id=payload.venue_id,
        event_id=payload.event_id
    )
    return res


@router.post("/optimize", status_code=status.HTTP_200_OK)
def optimize_academic_allocation(
    payload: AcademicCheckConflictRequest,
    db: Session = Depends(get_db)
):
    """
    Executes Google OR-Tools Binary Integer Programming solver considering Academic Timetable constraints.
    """
    event_id = payload.event_id or 1
    try:
        return solve_academic_ortools_optimization(
            db=db,
            event_id=event_id,
            requested_day=payload.day_of_week or "Monday",
            requested_start_time=payload.start_time or "10:00",
            requested_end_time=payload.end_time or "12:00",
            requested_venue_id=payload.venue_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Academic OR-Tools optimization failed: {str(e)}"
        )
