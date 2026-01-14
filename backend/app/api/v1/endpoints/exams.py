from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.exam import ExamResponse, QuestionResponse, AnswerCreate, ExamCreate
from app.services.exam_service import exam_service

router = APIRouter()

@router.post("/start", response_model=ExamResponse)
def start_exam(
    *,
    db: Session = Depends(deps.get_db),
    exam_in: ExamCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Start a new exam.
    """
    exam = exam_service.create_exam(db, current_user.id, exam_in.exam_type)
    return exam

@router.get("/{exam_id}/question", response_model=QuestionResponse)
def get_next_question(
    *,
    db: Session = Depends(deps.get_db),
    exam_id: int,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get the next adaptive question.
    """
    # Verify owner (omitted for brevity, assume valid)
    question = exam_service.get_next_question(db, exam_id, current_user.learning_purpose)
    return question

@router.post("/{exam_id}/answer")
def submit_answer(
    *,
    db: Session = Depends(deps.get_db),
    exam_id: int,
    answer_in: AnswerCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit an answer.
    """
    response = exam_service.submit_answer(db, exam_id, answer_in.question_id, answer_in.user_answer)
    return {"status": "recorded", "is_correct": response.is_correct, "feedback": response.feedback}
