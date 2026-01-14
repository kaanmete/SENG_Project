from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=False)  # For email verification
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Profile
    learning_purpose = Column(String, default="general") # exam, business, travel, academic, general
    
    # Relationships
    exams = relationship("Exam", back_populates="user")
    study_plans = relationship("StudyPlan", back_populates="user")
