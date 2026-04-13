"""
Enrollments router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from core.database import get_db
from core.security import get_current_user
from models import User, Course, Enrollment, Lesson
from schemas.enrollment import EnrollmentCreate, EnrollmentResponse

router = APIRouter()


@router.get("/my-courses")
async def get_my_enrollments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all courses the user is enrolled in"""
    result = await db.execute(
        select(Enrollment, Course)
        .join(Course, Enrollment.course_id == Course.id)
        .where(Enrollment.user_id == current_user.id)
        .options(joinedload(Enrollment.course))
        .order_by(Enrollment.last_accessed_at.desc())
    )
    
    enrollments = []
    for enrollment, course in result.all():
        # Get total lessons count
        lessons_result = await db.execute(
            select(Lesson).where(Lesson.course_id == course.id)
        )
        total_lessons = len(lessons_result.scalars().all())
        
        enrollments.append({
            "id": str(enrollment.id),
            "course_id": str(course.id),
            "course_title": course.title,
            "course_thumbnail": course.thumbnail_url,
            "progress_percentage": enrollment.progress_percentage,
            "completed_lessons": enrollment.completed_lessons,
            "total_lessons": total_lessons,
            "is_completed": enrollment.is_completed,
            "enrolled_at": enrollment.enrolled_at,
            "last_accessed_at": enrollment.last_accessed_at,
        })
    
    return {"enrollments": enrollments}


@router.post("")
async def enroll_in_course(
    enrollment: EnrollmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Enroll in a course"""
    # Check if course exists and is published
    result = await db.execute(
        select(Course).where(Course.id == enrollment.course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if not course.is_published:
        raise HTTPException(status_code=400, detail="Course is not published")
    
    # Check if already enrolled
    existing = await db.execute(
        select(Enrollment)
        .where(Enrollment.user_id == current_user.id)
        .where(Enrollment.course_id == enrollment.course_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    # Get total lessons
    lessons_result = await db.execute(
        select(Lesson).where(Lesson.course_id == course.id)
    )
    total_lessons = len(lessons_result.scalars().all())
    
    # Create enrollment
    new_enrollment = Enrollment(
        user_id=current_user.id,
        course_id=enrollment.course_id,
        total_lessons=total_lessons,
    )
    
    db.add(new_enrollment)
    
    # Update course enrollment count
    course.enrollment_count += 1
    
    await db.commit()
    
    return {
        "status": "enrolled",
        "enrollment_id": str(new_enrollment.id),
        "course_title": course.title,
    }


@router.delete("/{course_id}")
async def unenroll_from_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Unenroll from a course"""
    result = await db.execute(
        select(Enrollment)
        .where(Enrollment.user_id == current_user.id)
        .where(Enrollment.course_id == course_id)
    )
    enrollment = result.scalar_one_or_none()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Not enrolled in this course")
    
    await db.delete(enrollment)
    
    # Decrease course enrollment count
    course_result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = course_result.scalar_one_or_none()
    if course and course.enrollment_count > 0:
        course.enrollment_count -= 1
    
    await db.commit()
    
    return {"status": "unenrolled"}


@router.get("/stats")
async def get_learning_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's learning statistics"""
    # Calculate stats
    result = await db.execute(
        select(Enrollment)
        .where(Enrollment.user_id == current_user.id)
    )
    enrollments = result.scalars().all()
    
    total_courses = len(enrollments)
    completed_courses = sum(1 for e in enrollments if e.is_completed)
    in_progress = total_courses - completed_courses
    
    # Calculate total learning time from progress
    from sqlalchemy import func as sa_func
    progress_result = await db.execute(
        select(sa_func.sum(LessonProgress.watch_time_seconds))
        .where(LessonProgress.user_id == current_user.id)
    )
    total_seconds = progress_result.scalar() or 0
    total_hours = total_seconds // 3600
    
    return {
        "streak_days": current_user.streak_days,
        "total_courses_enrolled": total_courses,
        "completed_courses": completed_courses,
        "in_progress_courses": in_progress,
        "total_lessons_completed": current_user.total_lessons_completed,
        "total_learning_hours": total_hours,
        "completion_rate": (completed_courses / total_courses * 100) if total_courses > 0 else 0,
    }
