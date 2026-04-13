"""
Users router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user, require_admin
from models import User, UserRole
from schemas.user import UserProfileUpdate, UserProfileResponse, PublicProfileResponse

router = APIRouter()


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's profile"""
    return UserProfileResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        bio=current_user.bio,
        role=current_user.role,
        streak_days=current_user.streak_days,
        total_lessons_completed=current_user.total_lessons_completed,
        total_learning_minutes=current_user.total_learning_minutes,
        created_at=current_user.created_at,
    )


@router.patch("/me")
async def update_profile(
    update: UserProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update user profile"""
    if update.name is not None:
        current_user.name = update.name
    
    if update.bio is not None:
        current_user.bio = update.bio
    
    if update.avatar_url is not None:
        current_user.avatar_url = update.avatar_url
    
    await db.commit()
    
    return {"status": "updated"}


@router.get("/{user_id}", response_model=PublicProfileResponse)
async def get_public_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get public profile of a user"""
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return PublicProfileResponse(
        id=str(user.id),
        name=user.name,
        avatar_url=user.avatar_url,
        bio=user.bio,
        role=user.role,
        streak_days=user.streak_days,
        total_lessons_completed=user.total_lessons_completed,
    )


@router.post("/become-instructor")
async def become_instructor(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Request to become an instructor"""
    # In production, this would require approval workflow
    # For now, direct upgrade
    current_user.role = UserRole.INSTRUCTOR
    await db.commit()
    
    return {"status": "success", "role": "instructor"}
