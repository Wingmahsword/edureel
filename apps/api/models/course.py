"""
Course and Lesson models
"""

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, Boolean, Float, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base
import uuid


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Course metadata
    tags = Column(ARRAY(String), default=list)
    difficulty = Column(String, default="beginner")  # beginner, intermediate, advanced
    estimated_duration = Column(Integer, default=0)  # in minutes
    is_published = Column(Boolean, default=False)
    is_ai_generated = Column(Boolean, default=False)
    
    # Engagement stats
    enrollment_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    instructor = relationship("User", backref="courses")
    lessons = relationship("Lesson", back_populates="course", order_by="Lesson.order")


class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    video_url = Column(String, nullable=True)
    
    # Lesson metadata
    order = Column(Integer, default=0)
    duration = Column(Integer, default=0)  # in seconds
    
    # AI features
    ai_summary = Column(Text, nullable=True)
    ai_quiz_questions = Column(Text, nullable=True)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    course = relationship("Course", back_populates="lessons")
