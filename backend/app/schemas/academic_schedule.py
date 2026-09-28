from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AcademicScheduleBase(BaseModel):
    department_code: str = "CSE"
    day_of_week: str = "Monday"
    schedule_date: Optional[date] = None
    start_time: time
    end_time: time
    semester: Optional[int] = 5
    section: Optional[str] = "A"
    subject_activity: str
    venue_id: Optional[int] = None
    is_mandatory: bool = True
    is_blocked: bool = True


class AcademicScheduleCreate(AcademicScheduleBase):
    institution_id: int = 1
    department_id: Optional[int] = None


class AcademicScheduleOut(AcademicScheduleBase):
    id: int
    institution_id: int
    department_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AcademicCheckConflictRequest(BaseModel):
    event_id: Optional[int] = None
    department_code: str = "CSE"
    date_str: Optional[str] = "2026-10-15"
    day_of_week: Optional[str] = "Monday"
    start_time: str = "10:00"
    end_time: str = "12:00"
    venue_id: Optional[int] = 2


class AcademicCheckConflictResponse(BaseModel):
    has_conflict: bool
    status: str  # AVAILABLE, CONFLICT_DETECTED
    message: str
    conflict_reasons: list[str]
    alternative_slots: list[dict]
    alternative_venues: list[dict]
