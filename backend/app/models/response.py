from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    
    user_answer = Column(Text)
    is_correct = Column(Boolean, default=False)
    score = Column(Float, default=0.0) # For partial credit or AI scoring (0.0-1.0)
    
    feedback = Column(Text, nullable=True) # AI feedback for this specific answer
    submitted_at = Column(TIMESTAMP, server_default=func.now())
    
    exam = relationship("Exam", back_populates="responses")
    question = relationship("Question", back_populates="responses")
