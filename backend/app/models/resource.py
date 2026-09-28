from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(50), nullable=False, default="OTHER")  # STAFF, VENUE, EQUIPMENT, TRANSPORT, FOOD, BUDGET, OTHER
    total_quantity = Column(Integer, nullable=False, default=0)
    available_quantity = Column(Integer, nullable=False, default=0)
    allocated_quantity = Column(Integer, nullable=False, default=0)
    unit = Column(String(50), nullable=True, default="units")
    status = Column(String(50), nullable=False, default="HEALTHY")  # HEALTHY, WARNING, CRITICAL
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    institution = relationship("Institution", back_populates="resources")
    notifications = relationship("Notification", back_populates="related_resource", cascade="all, delete-orphan")
