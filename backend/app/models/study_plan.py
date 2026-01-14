from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    target_level = Column(String)
    tasks = Column(JSON) # Detailed JSON of the plan
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="study_plans")
