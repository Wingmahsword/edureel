"""
User schemas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    role: str
    streak_days: int
    total_lessons_completed: int
    total_learning_minutes: int
    created_at: Optional[datetime] = None


class PublicProfileResponse(BaseModel):
    id: str
    name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    role: str
    streak_days: int
    total_lessons_completed: int
