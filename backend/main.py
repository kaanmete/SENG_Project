from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv
load_dotenv()
import os

# We are calling app modules
from app import models, schemas, auth, database

# We are calling routers (API paths)
from app.routers import exams, users,admin

# 1. Create Database Tables
models.Base.metadata.create_all(bind=database.engine)


app = FastAPI()

# --- CORS SETTINGS ---
origins = [
    "http://localhost:3000",      # Frontend (React)
    "http://127.0.0.1:3000",
    "*",
    "https://frontend-production-8885.up.railway.app",
    "https://aidiagnosticengine.up.railway.app/login",
    "https://aidiagnosticengine.up.railway.app/register",
    "https://aidiagnosticengine.up.railway.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUDE ROUTERS IN THE SYSTEM ---
app.include_router(exams.router) # Exam endpoints
app.include_router(users.router)
app.include_router(admin.router) # User profile (/me) endpoint (Resolves name issue)
app.include_router(stats.router) 

# Obtain database connection
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ESSENTIAL ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "SENG Project Backend Çalışıyor! 🚀"}

# 1. USER REGISTRATION
@app.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Email var mı kontrol et
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı!")
    
    # Hash the password
    hashed_password = auth.get_password_hash(user.password)
    
    # Create a new user
    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        learning_purpose=user.learning_purpose,
        role="user" 
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# 2. LOGIN
@app.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Find the user
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    # If no user exists or the password is incorrect
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hatalı email veya şifre",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create Tokens
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
