from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, default="INFO")  # INFO, WARNING, SUCCESS, ERROR
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    related_event_id = Column(Integer, ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    related_resource_id = Column(Integer, ForeignKey("resources.id", ondelete="SET NULL"), nullable=True)

    related_event = relationship("Event", back_populates="notifications")
    related_resource = relationship("Resource", back_populates="notifications")
