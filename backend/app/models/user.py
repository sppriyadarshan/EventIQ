from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserRole:
    ADMIN = "ADMIN"
    FACULTY = "FACULTY"
    LOGISTICS = "LOGISTICS"
    PARTICIPANT = "PARTICIPANT"

    ALL_ROLES = [ADMIN, FACULTY, LOGISTICS, PARTICIPANT]


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default=UserRole.PARTICIPANT)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    department = relationship("Department")
    registrations = relationship("EventRegistration", back_populates="user", cascade="all, delete-orphan")
