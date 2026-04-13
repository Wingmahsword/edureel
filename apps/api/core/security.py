"""
Security utilities
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.config import settings
from core.database import get_db
from models import User, UserRole

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the current authenticated user from Clerk token"""
    from clerk_backend_api import Clerk
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    
    try:
        clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)
        
        # Verify the token and get user info
        session = clerk.sessions.verify(
            session_id=credentials.credentials,
            options={"jwt_key": settings.CLERK_SECRET_KEY}
        )
        
        clerk_user_id = session.user_id
        
        # Find user in our database
        result = await db.execute(
            select(User).where(User.clerk_id == clerk_user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found in system",
            )
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )


def require_role(required_role: UserRole):
    """Dependency factory for role-based access control"""
    async def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        role_hierarchy = {
            UserRole.STUDENT: 0,
            UserRole.INSTRUCTOR: 1,
            UserRole.ADMIN: 2,
        }
        
        if role_hierarchy[current_user.role] < role_hierarchy[required_role]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {required_role.value}",
            )
        return current_user
    return role_checker


# Convenience dependencies
require_instructor = require_role(UserRole.INSTRUCTOR)
require_admin = require_role(UserRole.ADMIN)
