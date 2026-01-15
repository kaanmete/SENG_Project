from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

# 1. KULLANICI TABLOSU
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    learning_purpose = Column(String)
    role = Column(String, default="user")
    created_at = Column(TIMESTAMP, server_default=func.now()) # <-- Hata veren yer burasıydı, artık düzeldi

    # İlişkiler
    attempts = relationship("ExamAttempt", back_populates="owner")

# 2. SORU TABLOSU
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    skill_type = Column(String)  # Grammar, Vocabulary, Reading
    difficulty = Column(String)  # Easy, Medium, Hard
    context_text = Column(String, nullable=True) # Okuma parçaları için
    question_text = Column(String)
    options = Column(JSON)       # Şıklar {"A": "...", "B": "..."}
    correct_option = Column(String)

# 3. SINAV SONUÇLARI (KARNE) TABLOSU
class ExamAttempt(Base):
    __tablename__ = "exam_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_type = Column(String) # Hangi yetenek?
    difficulty = Column(String) # Zorluk?
    score = Column(Integer)     # Puan
    total_questions = Column(Integer)
    correct_count = Column(Integer)
    date_taken = Column(DateTime, default=datetime.utcnow) # Ne zaman?

    owner = relationship("User", back_populates="attempts")