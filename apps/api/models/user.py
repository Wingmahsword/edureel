"""
User model
"""

from sqlalchemy import Column, String, DateTime, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from core.database import Base
import uuid
import enum


class UserRole(str, enum.Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    
    # Learning stats
    streak_days = Column(Integer, default=0)
    total_lessons_completed = Column(Integer, default=0)
    total_learning_minutes = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_active_at = Column(DateTime(timezone=True), nullable=True)
