from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class RegistrationBase(BaseModel):
    participant_name: str
    participant_email: EmailStr
    register_number: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None


class RegistrationCreate(RegistrationBase):
    event_id: int


class RegistrationUpdate(BaseModel):
    participant_name: Optional[str] = None
    register_number: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = None
    checked_in: Optional[bool] = None


class RegistrationOut(RegistrationBase):
    id: int
    event_id: int
    registration_date: datetime
    status: str
    qr_token: Optional[str] = None
    checked_in: bool
    checked_in_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EventPassInfo(BaseModel):
    name: str
    theme: Optional[str] = None
    theme_id: Optional[str] = None


class VenuePassInfo(BaseModel):
    name: str


class SchedulePassInfo(BaseModel):
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None


class FoodPassInfo(BaseModel):
    details: Optional[str] = None


class AttendancePassInfo(BaseModel):
    checked_in: bool
    checked_in_at: Optional[str] = None


class PersonalizedPassOut(BaseModel):
    registration_id: str
    student_name: str
    event: EventPassInfo
    venue: VenuePassInfo
    schedule: SchedulePassInfo
    food: FoodPassInfo
    registration_status: str
    attendance: AttendancePassInfo

