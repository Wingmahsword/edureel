"""
Enrollment and Progress models
"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Boolean, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base
import uuid


class Enrollment(Base):
    __tablename__ = "enrollments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    
    # Progress tracking
    completed_lessons = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    progress_percentage = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    
    # Timestamps
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Unique constraint
    __table_args__ = (
        UniqueConstraint('user_id', 'course_id', name='unique_user_course_enrollment'),
    )
    
    # Relationships
    user = relationship("User", backref="enrollments")
    course = relationship("Course", backref="enrollments")


class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=False)
    
    # Progress tracking
    is_completed = Column(Boolean, default=False)
    watch_time_seconds = Column(Integer, default=0)
    completion_percentage = Column(Integer, default=0)
    
    # AI interactions
    ai_questions_asked = Column(Integer, default=0)
    quiz_score = Column(Integer, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", backref="lesson_progress")
    lesson = relationship("Lesson", backref="progress")
