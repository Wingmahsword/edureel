"""
EduSpark Backend API
FastAPI + PostgreSQL + Redis + Celery + OpenAI
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from core.config import settings
from core.database import engine, Base
from routers import auth, courses, lessons, feed, ai, users, enrollments


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="EduSpark API",
    description="AI-powered learning platform backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"},
    )


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(courses.router, prefix="/api/v1/courses", tags=["Courses"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(feed.router, prefix="/api/v1/feed", tags=["Feed"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(enrollments.router, prefix="/api/v1/enrollments", tags=["Enrollments"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
