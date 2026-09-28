from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Date, Time, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class AcademicSchedule(Base):
    __tablename__ = "academic_schedules"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    department_code = Column(String(50), nullable=False, default="CSE", index=True)
    
    day_of_week = Column(String(20), nullable=False, default="Monday", index=True)  # Monday, Tuesday, etc.
    schedule_date = Column(Date, nullable=True)  # Optional specific date override
    
    start_time = Column(Time, nullable=False)  # e.g., 10:00:00
    end_time = Column(Time, nullable=False)    # e.g., 12:00:00
    
    semester = Column(Integer, nullable=True, default=5)
    section = Column(String(10), nullable=True, default="A")
    subject_activity = Column(String(255), nullable=False)  # e.g., "Data Structures Lab", "Midterm Exam"
    
    venue_id = Column(Integer, ForeignKey("venues.id", ondelete="SET NULL"), nullable=True)
    is_mandatory = Column(Boolean, default=True)  # Mandatory class attendance for dept students
    is_blocked = Column(Boolean, default=True)    # Slot blocked for non-academic events
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    institution = relationship("Institution", backref="academic_schedules")
    department = relationship("Department", backref="academic_schedules")
    venue = relationship("Venue", backref="academic_schedules")
