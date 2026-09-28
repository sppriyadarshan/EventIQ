from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, Date, Time, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    capacity = Column(Integer, nullable=False, default=100)
    venue_type = Column(String(100), nullable=True, default="Auditorium")
    available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    institution = relationship("Institution", back_populates="venues")
    events = relationship("Event", back_populates="venue")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    event_type = Column(String(100), nullable=False, default="Workshop")
    organizer = Column(String(255), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    venue_id = Column(Integer, ForeignKey("venues.id", ondelete="SET NULL"), nullable=True)
    
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    
    expected_participants = Column(Integer, default=0)
    capacity = Column(Integer, default=100)
    registration_deadline = Column(DateTime, nullable=True)
    status = Column(String(50), default="UPCOMING", nullable=False)  # DRAFT, UPCOMING, ONGOING, COMPLETED, CANCELLED
    budget = Column(Float, default=0.0)
    
    theme = Column(String(255), nullable=True)
    theme_id = Column(String(100), nullable=True)
    food_details = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    institution = relationship("Institution", back_populates="events")
    department = relationship("Department", back_populates="events")
    venue = relationship("Venue", back_populates="events")
    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="related_event", cascade="all, delete-orphan")
