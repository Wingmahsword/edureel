"""
Course schemas
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: List[str] = []
    difficulty: str = "beginner"
    estimated_duration: int = 0


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[List[str]] = None
    difficulty: Optional[str] = None
    is_published: Optional[bool] = None


class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    order: Optional[int] = None
    duration: int = 0
    ai_summary: Optional[str] = None


class LessonResponse(BaseModel):
    id: str
    title: str
    duration: int
    order: int
    ai_summary: Optional[str] = None


class CourseResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    instructor_name: str
    instructor_avatar: Optional[str] = None
    tags: List[str]
    difficulty: str
    estimated_duration: int
    enrollment_count: int
    rating: float
    review_count: int
    created_at: Optional[datetime] = None


class CourseDetailResponse(CourseResponse):
    instructor_bio: Optional[str] = None
    is_enrolled: bool
    is_published: bool
    lessons: List[LessonResponse]
