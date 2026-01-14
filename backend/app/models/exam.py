from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    exam_type = Column(String) # integrated, reading, listening, grammar, vocabulary
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="in_progress") # in_progress, completed
    
    # Results
    total_score = Column(Float, nullable=True)
    cefr_level = Column(String, nullable=True) # A1, A2, B1, B2, C1, C2
    feedback_summary = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="exams")
    responses = relationship("Response", back_populates="exam")
