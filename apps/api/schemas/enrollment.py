"""
Enrollment schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EnrollmentCreate(BaseModel):
    course_id: str


class EnrollmentResponse(BaseModel):
    id: str
    course_id: str
    course_title: str
    progress_percentage: int
    is_completed: bool
    enrolled_at: datetime
    last_accessed_at: Optional[datetime] = None
