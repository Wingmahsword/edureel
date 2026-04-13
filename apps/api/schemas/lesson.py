"""
Lesson schemas
"""

from pydantic import BaseModel
from typing import Optional


class LessonProgressUpdate(BaseModel):
    is_completed: Optional[bool] = None
    watch_time_seconds: Optional[int] = None
    completion_percentage: Optional[int] = None


class LessonProgressResponse(BaseModel):
    is_completed: bool
    watch_time_seconds: int
    completion_percentage: int
    ai_questions_asked: int


class LessonDetailResponse(BaseModel):
    id: str
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration: int
    order: int
    course_id: str
    course_title: str
    ai_summary: Optional[str] = None
    ai_quiz_questions: Optional[str] = None
    progress: Optional[LessonProgressResponse] = None
    is_enrolled: bool
