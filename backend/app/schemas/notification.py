from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class NotificationBase(BaseModel):
    title: str
    message: str
    type: str = "INFO"  # INFO, WARNING, SUCCESS, ERROR
    is_read: bool = False


class NotificationCreate(NotificationBase):
    related_event_id: Optional[int] = None
    related_resource_id: Optional[int] = None


class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    type: Optional[str] = None
    is_read: Optional[bool] = None


class NotificationOut(NotificationBase):
    id: int
    created_at: datetime
    related_event_id: Optional[int] = None
    related_resource_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
