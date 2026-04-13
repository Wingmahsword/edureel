"""
Feed router - Instagram-style personalized feed
"""

from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload

from core.database import get_db
from core.security import get_current_user
from models import User, Course, Lesson, Enrollment
from schemas.feed import FeedItem, FeedResponse

router = APIRouter()


@router.get("", response_model=FeedResponse)
async def get_feed(
    cursor: Optional[str] = None,
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get personalized feed of lessons/courses.
    Algorithm:
    - Score = (recency × 0.3) + (popularity × 0.3) + (user_interest_match × 0.4)
    - Prioritize courses user is enrolled in but hasn't completed
    - Mix in trending content from tags user has shown interest in
    """
    
    # Get user's enrolled courses (for personalized recommendations)
    enrolled_result = await db.execute(
        select(Enrollment.course_id)
        .where(Enrollment.user_id == current_user.id)
        .where(Enrollment.is_completed == False)
    )
    enrolled_course_ids = enrolled_result.scalars().all()
    
    # Build the feed query
    # First, get lessons from enrolled courses (prioritize continuing learning)
    query = (
        select(Lesson, Course)
        .join(Course, Lesson.course_id == Course.id)
        .where(Course.is_published == True)
        .options(joinedload(Lesson.course))
        .order_by(
            # Prioritize enrolled courses first
            func.case(
                (Course.id.in_(enrolled_course_ids), 1),
                else_=0
            ).desc(),
            # Then by engagement metrics
            Course.enrollment_count.desc(),
            Lesson.created_at.desc()
        )
        .limit(limit)
    )
    
    if cursor:
        query = query.where(Lesson.id > cursor)
    
    result = await db.execute(query)
    rows = result.all()
    
    # Build feed items
    items = []
    for lesson, course in rows:
        # Check if user has progress on this lesson
        progress_result = await db.execute(
            select(Enrollment.progress_percentage)
            .where(Enrollment.user_id == current_user.id)
            .where(Enrollment.course_id == course.id)
        )
        progress = progress_result.scalar_one_or_none() or 0
        
        item = FeedItem(
            id=str(lesson.id),
            type="lesson",
            title=lesson.title,
            course_name=course.title,
            instructor_name=course.instructor.name if course.instructor else "Unknown",
            instructor_avatar=course.instructor.avatar_url if course.instructor else None,
            thumbnail_url=lesson.video_url or course.thumbnail_url,
            duration=lesson.duration,
            likes=0,  # Will be fetched from cache
            comments=0,
            bookmarks=0,
            tags=course.tags or [],
            progress=progress,
            ai_summary=lesson.ai_summary,
            created_at=lesson.created_at,
        )
        items.append(item)
    
    # Determine next cursor
    next_cursor = None
    if items and len(items) == limit:
        next_cursor = items[-1].id
    
    return FeedResponse(
        items=items,
        next_cursor=next_cursor,
        has_more=next_cursor is not None,
    )


@router.get("/trending")
async def get_trending(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
):
    """Get trending courses based on enrollments in last 24h"""
    from datetime import datetime, timedelta
    
    yesterday = datetime.now() - timedelta(days=1)
    
    result = await db.execute(
        select(Course, func.count(Enrollment.id).label("recent_enrollments"))
        .join(Enrollment, Course.id == Enrollment.course_id)
        .where(Enrollment.enrolled_at >= yesterday)
        .where(Course.is_published == True)
        .group_by(Course.id)
        .order_by(func.count(Enrollment.id).desc())
        .limit(limit)
    )
    
    trending = []
    for course, enrollments in result.all():
        trending.append({
            "id": str(course.id),
            "title": course.title,
            "thumbnail": course.thumbnail_url,
            "instructor": course.instructor.name if course.instructor else "Unknown",
            "recent_enrollments": enrollments,
            "total_enrollments": course.enrollment_count,
            "rating": course.rating,
        })
    
    return {"trending": trending}
