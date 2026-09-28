from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, Time, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class HistoricalEvent(Base):
    __tablename__ = "historical_events"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    original_event_id = Column(Integer, ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    
    title = Column(String(255), nullable=False)
    event_type = Column(String(100), nullable=False)
    department_code = Column(String(50), nullable=True)
    venue_name = Column(String(255), nullable=True)
    venue_capacity = Column(Integer, default=100)
    
    event_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=True)
    duration_hours = Column(Float, default=2.0)
    
    expected_attendance = Column(Integer, default=0)
    registered_count = Column(Integer, default=0)
    actual_attendance = Column(Integer, default=0)
    turnout_rate = Column(Float, default=0.0)  # Ratio of actual / registered
    
    weather_condition = Column(String(100), nullable=True, default="Clear")
    is_holiday = Column(Boolean, default=False)
    budget_allocated = Column(Float, default=0.0)
    budget_spent = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    institution = relationship("Institution", back_populates="historical_events")
