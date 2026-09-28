from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    participant_name = Column(String(255), nullable=False)
    participant_email = Column(String(255), nullable=False, index=True)
    register_number = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    year = Column(String(20), nullable=True)
    registration_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="REGISTERED")  # REGISTERED, WAITLISTED, CANCELLED, ATTENDED
    qr_token = Column(String(255), nullable=True)
    checked_in = Column(Boolean, default=False)
    checked_in_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    event = relationship("Event", back_populates="registrations")
    user = relationship("User", back_populates="registrations")

    __table_args__ = (
        UniqueConstraint("event_id", "participant_email", name="uq_event_participant"),
    )
