from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class HistoricalEventBase(BaseModel):
    title: str
    event_type: str
    department_code: Optional[str] = None
    venue_name: Optional[str] = None
    venue_capacity: int = 100
    event_date: date
    start_time: Optional[time] = None
    duration_hours: float = 2.0
    expected_attendance: int = 0
    registered_count: int = 0
    actual_attendance: int = 0
    turnout_rate: float = 0.0
    weather_condition: Optional[str] = "Clear"
    is_holiday: bool = False
    budget_allocated: float = 0.0
    budget_spent: float = 0.0


class HistoricalEventCreate(HistoricalEventBase):
    institution_id: int
    original_event_id: Optional[int] = None


class HistoricalEventOut(HistoricalEventBase):
    id: int
    institution_id: int
    original_event_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
