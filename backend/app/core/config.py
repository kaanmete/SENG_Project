import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Level Assessment AI Engine"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str ="postgresql://postgres:zLayycupXQjemFwcWkPTMervocOmhvQu@postgres.railway.internal:5432/railway"
    
    # Security
    JWT_SECRET: str = "e1a6dcd489ffd80ddf3ad7a05765d057"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    
    # CORS
    FRONTEND_URL: str = "https://frontend-production-77355.up.railway.app"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://web-production-a7769.up.railway.app",
        "https://frontend-production-77355.up.railway.app"
    ]

    # OpenAI
    OPENAI_API_KEY: Optional[str] = "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"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
