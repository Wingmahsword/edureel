"""
Lessons router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from core.database import get_db
from core.security import get_current_user, require_instructor
from models import User, Lesson, Course, LessonProgress, Enrollment
from schemas.lesson import LessonDetailResponse, LessonProgressUpdate, LessonProgressResponse

router = APIRouter()


@router.get("/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get lesson details with user progress"""
    result = await db.execute(
        select(Lesson)
        .where(Lesson.id == lesson_id)
        .options(joinedload(Lesson.course))
    )
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if user is enrolled
    enrollment_result = await db.execute(
        select(Enrollment)
        .where(Enrollment.user_id == current_user.id)
        .where(Enrollment.course_id == lesson.course_id)
    )
    enrollment = enrollment_result.scalar_one_or_none()
    
    # Get or create progress
    progress_result = await db.execute(
        select(LessonProgress)
        .where(LessonProgress.user_id == current_user.id)
        .where(LessonProgress.lesson_id == lesson_id)
    )
    progress = progress_result.scalar_one_or_none()
    
    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
        )
        db.add(progress)
        await db.commit()
    
    return LessonDetailResponse(
        id=str(lesson.id),
        title=lesson.title,
        content=lesson.content,
        video_url=lesson.video_url,
        duration=lesson.duration,
        order=lesson.order,
        course_id=str(lesson.course_id),
        course_title=lesson.course.title,
        ai_summary=lesson.ai_summary,
        ai_quiz_questions=lesson.ai_quiz_questions,
        progress=LessonProgressResponse(
            is_completed=progress.is_completed,
            watch_time_seconds=progress.watch_time_seconds,
            completion_percentage=progress.completion_percentage,
            ai_questions_asked=progress.ai_questions_asked,
        ) if progress else None,
        is_enrolled=enrollment is not None,
    )


@router.post("/{lesson_id}/progress")
async def update_progress(
    lesson_id: str,
    update: LessonProgressUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update lesson progress"""
    result = await db.execute(
        select(LessonProgress)
        .where(LessonProgress.user_id == current_user.id)
        .where(LessonProgress.lesson_id == lesson_id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
        )
        db.add(progress)
    
    # Update fields
    if update.watch_time_seconds is not None:
        progress.watch_time_seconds = update.watch_time_seconds
    
    if update.completion_percentage is not None:
        progress.completion_percentage = update.completion_percentage
    
    if update.is_completed is not None:
        progress.is_completed = update.is_completed
        if update.is_completed and not progress.completed_at:
            progress.completed_at = func.now()
            # Update user stats
            current_user.total_lessons_completed += 1
    
    await db.commit()
    
    return {"status": "updated", "progress": progress.completion_percentage}


@router.post("/{lesson_id}/ask-ai")
async def increment_ai_count(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Track AI tutor usage for analytics"""
    result = await db.execute(
        select(LessonProgress)
        .where(LessonProgress.user_id == current_user.id)
        .where(LessonProgress.lesson_id == lesson_id)
    )
    progress = result.scalar_one_or_none()
    
    if progress:
        progress.ai_questions_asked += 1
        await db.commit()
    
    return {"status": "recorded"}
