from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime

# --- 1. KULLANICI & GİRİŞ İŞLEMLERİ ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    learning_purpose: Optional[str] = "general"

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- 2. SINAV SİSTEMİ ---
class QuestionOut(BaseModel):
    id: int
    skill_type: str
    difficulty: str
    question_text: str
    options: Dict[str, str]
    # correct_option GİZLİ

    class Config:
        from_attributes = True

class ExamSubmit(BaseModel):
    skill_type: str  # Hangi ders?
    difficulty: str  # Hangi zorluk?
    answers: Dict[int, str] # {SoruID: "Cevap"}

class ExamResult(BaseModel):
    score: int
    total_questions: int
    correct_count: int
    wrong_count: int
    feedback: str

# --- 3. İSTATİSTİKLER (PROFİL) ---
class ExamHistoryOut(BaseModel):
    id: int
    skill_type: str
    difficulty: str
    score: int
    date_taken: datetime

    class Config:
        from_attributes = True
        