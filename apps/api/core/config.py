"""
Application configuration
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "EduSpark API"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/eduspark"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Clerk Auth
    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""
    CLERK_JWKS_URL: str = "https://decent-lynx-77.clerk.accounts.dev/.well-known/jwks.json"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://eduspark.vercel.app",
    ]
    
    # AI Settings
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
