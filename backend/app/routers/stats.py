from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import database, models, schemas, auth

router = APIRouter(
    prefix="/stats",
    tags=["Statistics"]
)

# Retrieve the user's past exams
@router.get("/history", response_model=List[schemas.ExamHistoryOut])
def get_exam_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Only this user's exams
    attempts = db.query(models.ExamAttempt)\
        .filter(models.ExamAttempt.user_id == current_user.id)\
        .order_by(models.ExamAttempt.date_taken.desc())\
        .all()
        
    return attempts
