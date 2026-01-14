from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Configuration
# Allow ALL origins for debugging purposes to rule out CORS config issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.api import api_router
from app.db.session import engine
from app.db.base import Base

# Create tables on startup (Simple migration alternative for readiness)
# Create tables on startup (Simple migration alternative for readiness)
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")
except Exception as e:
    print(f"Error creating database tables: {e}")
    # Do not raise, let app start so we can see logs


app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"message": "Level Assessment AI Engine API is running", "docs": "/docs"}

@app.get("/api/info")
def info():
    return {"status": "ok", "version": "1.0.0"}
