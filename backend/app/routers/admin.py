from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas, auth

router = APIRouter(prefix="/admin", tags=["Admin"])

# Admin control auxiliary function
def check_admin(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Bu işlem için admin yetkisi gerekiyor!")
    return current_user

@router.get("/users")
def get_all_users(db: Session = Depends(database.get_db), _ = Depends(check_admin)):
    return db.query(models.User).all()

@router.get("/stats")
def get_system_stats(db: Session = Depends(database.get_db), _ = Depends(check_admin)):
    total_users = db.query(models.User).count()
    total_exams = db.query(models.ExamAttempt).count()
    return {"total_users": total_users, "total_exams": total_exams}
