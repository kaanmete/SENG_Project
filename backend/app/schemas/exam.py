from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class ExamCreate(BaseModel):
    exam_type: str = "integrated"

class QuestionResponse(BaseModel):
    id: int
    content: str
    options: Optional[Dict[str, str]]
    type: str

class AnswerCreate(BaseModel):
    question_id: int
    user_answer: str

class ExamResponse(BaseModel):
    id: int
    status: str
    start_time: datetime
