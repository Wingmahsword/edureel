"""
Auth router - Clerk integration
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from clerk_backend_api import Clerk
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.config import settings
from core.database import get_db
from models import User, UserRole
from schemas.auth import UserCreate, UserResponse, TokenResponse

router = APIRouter()
security = HTTPBearer()
clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)


async def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Clerk JWT token and return user info"""
    try:
        # Verify the session token
        session = clerk.sessions.verify(
            session_id=credentials.credentials,
            options={"jwt_key": settings.CLERK_SECRET_KEY}
        )
        return session
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")


@router.post("/webhook", status_code=200)
async def clerk_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle Clerk webhooks for user creation/updates
    """
    payload = await request.json()
    event_type = payload.get("type")
    data = payload.get("data", {})
    
    if event_type == "user.created":
        # Create user in our database
        clerk_id = data.get("id")
        email = data.get("email_addresses", [{}])[0].get("email_address")
        name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or "New User"
        avatar_url = data.get("image_url")
        
        existing = await db.execute(
            select(User).where(User.clerk_id == clerk_id)
        )
        if not existing.scalar_one_or_none():
            new_user = User(
                clerk_id=clerk_id,
                email=email,
                name=name,
                avatar_url=avatar_url,
                role=UserRole.STUDENT,
            )
            db.add(new_user)
            await db.commit()
            
    elif event_type == "user.updated":
        clerk_id = data.get("id")
        result = await db.execute(
            select(User).where(User.clerk_id == clerk_id)
        )
        user = result.scalar_one_or_none()
        if user:
            user.email = data.get("email_addresses", [{}])[0].get("email_address", user.email)
            user.name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or user.name
            user.avatar_url = data.get("image_url", user.avatar_url)
            await db.commit()
            
    elif event_type == "user.deleted":
        clerk_id = data.get("id")
        result = await db.execute(
            select(User).where(User.clerk_id == clerk_id)
        )
        user = result.scalar_one_or_none()
        if user:
            # Soft delete or mark inactive
            await db.delete(user)
            await db.commit()
    
    return {"status": "ok"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    db: AsyncSession = Depends(get_db),
    token_data = Depends(verify_clerk_token)
):
    """Get current authenticated user's info"""
    # Extract user ID from clerk session
    user_id = token_data.user_id
    
    result = await db.execute(
        select(User).where(User.clerk_id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        avatar_url=user.avatar_url,
        role=user.role,
        streak_days=user.streak_days,
        total_lessons_completed=user.total_lessons_completed,
        total_learning_minutes=user.total_learning_minutes,
    )
