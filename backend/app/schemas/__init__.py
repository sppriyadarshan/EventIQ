from app.schemas.institution import InstitutionCreate, InstitutionUpdate, InstitutionOut, DepartmentCreate, DepartmentUpdate, DepartmentOut
from app.schemas.event import EventCreate, EventUpdate, EventOut, VenueCreate, VenueUpdate, VenueOut
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceOut
from app.schemas.registration import RegistrationCreate, RegistrationUpdate, RegistrationOut
from app.schemas.notification import NotificationCreate, NotificationUpdate, NotificationOut
from app.schemas.historical_event import HistoricalEventCreate, HistoricalEventOut

__all__ = [
    "InstitutionCreate", "InstitutionUpdate", "InstitutionOut",
    "DepartmentCreate", "DepartmentUpdate", "DepartmentOut",
    "EventCreate", "EventUpdate", "EventOut",
    "VenueCreate", "VenueUpdate", "VenueOut",
    "ResourceCreate", "ResourceUpdate", "ResourceOut",
    "RegistrationCreate", "RegistrationUpdate", "RegistrationOut",
    "NotificationCreate", "NotificationUpdate", "NotificationOut",
    "HistoricalEventCreate", "HistoricalEventOut",
]
