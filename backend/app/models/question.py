from sqlalchemy import Column, Integer, String, JSON, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    
    type = Column(String) # reading, listening, grammar, vocabulary, speaking, writing
    difficulty_level = Column(Integer) # 1-6 corresponding to A1-C2
    
    content = Column(Text) # Question text or prompt
    options = Column(JSON, nullable=True) # For multiple choice: {"A": "...", "B": "..."}
    correct_answer = Column(Text, nullable=True) # Key like "A" or the actual text answer
    explanation = Column(Text, nullable=True) # For feedback
    
    media_url = Column(String, nullable=True) # For listening/image questions
    
    responses = relationship("Response", back_populates="question")
