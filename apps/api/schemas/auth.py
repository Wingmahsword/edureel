"""
Auth schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    clerk_id: str
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    role: str
    streak_days: int
    total_lessons_completed: int
    total_learning_minutes: int


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
