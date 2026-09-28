from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String(100), unique=True, index=True, nullable=False)
    registration_id = Column(Integer, ForeignKey("event_registrations.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    
    student_name = Column(String(255), nullable=False)
    event_name = Column(String(255), nullable=False)
    institution_name = Column(String(255), nullable=False, default="EventIQ Institute of Technology")
    event_date = Column(String(100), nullable=True)
    venue_name = Column(String(255), nullable=True)
    registration_id_display = Column(String(100), nullable=True)
    organizer_name = Column(String(255), nullable=True)
    
    issued_at = Column(DateTime, default=datetime.utcnow)
    verification_token = Column(String(255), unique=True, index=True, nullable=False)
    status = Column(String(50), default="VALID", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    registration = relationship("EventRegistration", backref="certificate")
    event = relationship("Event", backref="certificates")
