"""
Courses router
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload

from core.database import get_db
from core.security import get_current_user, require_instructor
from models import User, Course, Lesson, Enrollment, UserRole
from schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseDetailResponse,
    LessonCreate,
    LessonResponse,
)

router = APIRouter()


@router.get("", response_model=List[CourseResponse])
async def list_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    tag: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all published courses with filters"""
    query = select(Course).where(Course.is_published == True)
    
    if tag:
        query = query.where(Course.tags.contains([tag]))
    
    if difficulty:
        query = query.where(Course.difficulty == difficulty)
    
    if search:
        query = query.where(
            func.lower(Course.title).contains(search.lower()) |
            func.lower(Course.description).contains(search.lower())
        )
    
    query = query.order_by(Course.enrollment_count.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    courses = result.scalars().all()
    
    return [
        CourseResponse(
            id=str(c.id),
            title=c.title,
            description=c.description,
            thumbnail_url=c.thumbnail_url,
            instructor_name=c.instructor.name if c.instructor else "Unknown",
            instructor_avatar=c.instructor.avatar_url if c.instructor else None,
            tags=c.tags or [],
            difficulty=c.difficulty,
            estimated_duration=c.estimated_duration,
            enrollment_count=c.enrollment_count,
            rating=c.rating,
            review_count=c.review_count,
            created_at=c.created_at,
        )
        for c in courses
    ]


@router.get("/{course_id}", response_model=CourseDetailResponse)
async def get_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Get course details with lessons"""
    result = await db.execute(
        select(Course)
        .where(Course.id == course_id)
        .options(joinedload(Course.instructor), joinedload(Course.lessons))
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check enrollment status
    is_enrolled = False
    if current_user:
        enrollment_result = await db.execute(
            select(Enrollment)
            .where(Enrollment.user_id == current_user.id)
            .where(Enrollment.course_id == course.id)
        )
        is_enrolled = enrollment_result.scalar_one_or_none() is not None
    
    return CourseDetailResponse(
        id=str(course.id),
        title=course.title,
        description=c.description,
        thumbnail_url=c.thumbnail_url,
        instructor_name=c.instructor.name if c.instructor else "Unknown",
        instructor_avatar=c.instructor.avatar_url if c.instructor else None,
        instructor_bio=c.instructor.bio if c.instructor else None,
        tags=c.tags or [],
        difficulty=c.difficulty,
        estimated_duration=c.estimated_duration,
        enrollment_count=c.enrollment_count,
        rating=c.rating,
        review_count=c.review_count,
        is_enrolled=is_enrolled,
        is_published=course.is_published,
        created_at=c.created_at,
        lessons=[
            LessonResponse(
                id=str(l.id),
                title=l.title,
                duration=l.duration,
                order=l.order,
                ai_summary=l.ai_summary,
            )
            for l in sorted(course.lessons, key=lambda x: x.order)
        ],
    )


@router.post("", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    """Create a new course (instructor only)"""
    new_course = Course(
        title=course.title,
        description=course.description,
        thumbnail_url=course.thumbnail_url,
        instructor_id=current_user.id,
        tags=course.tags,
        difficulty=course.difficulty,
        estimated_duration=course.estimated_duration,
        is_published=False,  # Draft by default
    )
    
    db.add(new_course)
    await db.commit()
    await db.refresh(new_course)
    
    return CourseResponse(
        id=str(new_course.id),
        title=new_course.title,
        description=new_course.description,
        thumbnail_url=new_course.thumbnail_url,
        instructor_name=current_user.name,
        instructor_avatar=current_user.avatar_url,
        tags=new_course.tags or [],
        difficulty=new_course.difficulty,
        estimated_duration=new_course.estimated_duration,
        enrollment_count=0,
        rating=0.0,
        review_count=0,
        created_at=new_course.created_at,
    )


@router.post("/{course_id}/lessons", response_model=LessonResponse)
async def add_lesson(
    course_id: str,
    lesson: LessonCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    """Add a lesson to a course"""
    # Verify course ownership
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.instructor_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to edit this course")
    
    # Get max order for positioning
    result = await db.execute(
        select(func.max(Lesson.order)).where(Lesson.course_id == course_id)
    )
    max_order = result.scalar() or 0
    
    new_lesson = Lesson(
        course_id=course_id,
        title=lesson.title,
        content=lesson.content,
        video_url=lesson.video_url,
        order=lesson.order or (max_order + 1),
        duration=lesson.duration,
        ai_summary=lesson.ai_summary,
    )
    
    db.add(new_lesson)
    await db.commit()
    await db.refresh(new_lesson)
    
    # Update course total duration
    course.estimated_duration += lesson.duration // 60
    await db.commit()
    
    return LessonResponse(
        id=str(new_lesson.id),
        title=new_lesson.title,
        duration=new_lesson.duration,
        order=new_lesson.order,
        ai_summary=new_lesson.ai_summary,
    )


@router.post("/{course_id}/publish")
async def publish_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_instructor),
):
    """Publish a course"""
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.instructor_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    course.is_published = True
    await db.commit()
    
    return {"status": "published"}


async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db),
):
    """Optional authentication - returns None if not authenticated"""
    if not credentials:
        return None
    try:
        return await get_current_user(credentials, db)
    except:
        return None
