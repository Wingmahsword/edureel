"""
Feed schemas
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class FeedItem(BaseModel):
    id: str
    type: str  # "lesson" or "course"
    title: str
    course_name: str
    instructor_name: str
    instructor_avatar: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: int  # in seconds
    likes: int
    comments: int
    bookmarks: int
    tags: List[str]
    progress: int  # 0-100
    ai_summary: Optional[str] = None
    created_at: Optional[datetime] = None


class FeedResponse(BaseModel):
    items: List[FeedItem]
    next_cursor: Optional[str] = None
    has_more: bool
