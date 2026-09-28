from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class VenueBase(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: int = 100
    venue_type: Optional[str] = "Auditorium"
    available: bool = True


class VenueCreate(VenueBase):
    institution_id: int


class VenueUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    venue_type: Optional[str] = None
    available: Optional[bool] = None


class VenueOut(VenueBase):
    id: int
    institution_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "Workshop"
    organizer: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    expected_participants: int = 0
    capacity: int = 100
    registration_deadline: Optional[datetime] = None
    status: str = "UPCOMING"
    budget: float = 0.0


class EventCreate(EventBase):
    institution_id: int
    department_id: Optional[int] = None
    venue_id: Optional[int] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    organizer: Optional[str] = None
    department_id: Optional[int] = None
    venue_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    expected_participants: Optional[int] = None
    capacity: Optional[int] = None
    registration_deadline: Optional[datetime] = None
    status: Optional[str] = None
    budget: Optional[float] = None


class EventOut(EventBase):
    id: int
    institution_id: int
    department_id: Optional[int] = None
    venue_id: Optional[int] = None
    venue: Optional[VenueOut] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
