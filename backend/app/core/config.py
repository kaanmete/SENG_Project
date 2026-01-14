import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Level Assessment AI Engine"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # Security
    JWT_SECRET: str = "unsafe_default_secret_for_debugging_only_change_in_prod"
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
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
