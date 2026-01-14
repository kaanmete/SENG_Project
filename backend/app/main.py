from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Configuration
# Dynamically add env FRONTEND_URL if not already in list
origins = list(settings.BACKEND_CORS_ORIGINS)
if settings.FRONTEND_URL and settings.FRONTEND_URL not in origins:
    origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.api import api_router
from app.db.session import engine
from app.db.base import Base

# Create tables on startup (Simple migration alternative for readiness)
Base.metadata.create_all(bind=engine)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"message": "Level Assessment AI Engine API is running", "docs": "/docs"}

@app.get("/api/info")
def info():
    return {"status": "ok", "version": "1.0.0"}
