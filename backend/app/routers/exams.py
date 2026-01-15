from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List
from app import database, models, schemas, auth

router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)

# 1. RASTGELE SINAV OLUŞTUR (GET /exams/start)
# Kullanıcı bu adrese gidince ona rastgele 10 soru vereceğiz.
@router.get("/start", response_model=List[schemas.QuestionOut])
def start_exam(
    skill: str = "vocabulary", # Varsayılan: vocabulary
    level: str = "Easy",       # Varsayılan: Easy
    limit: int = 5,            # Kaç soru gelsin?
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user) # Sadece giriş yapanlar!
):
    # Veritabanından rastgele (func.random) soruları çek
    questions = db.query(models.Question)\
        .filter(models.Question.skill_type == skill)\
        .filter(models.Question.difficulty == level)\
        .order_by(func.random())\
        .limit(limit)\
        .all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="Bu kriterlerde yeterli soru bulunamadı.")
        
    return questions

# 2. CEVAPLARI KONTROL ET (POST /exams/submit)
@router.post("/submit", response_model=schemas.ExamResult)
def submit_exam(
    submission: schemas.ExamSubmit,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    score = 0
    correct = 0
    wrong = 0
    
    # 1. Puanı Hesapla
    for question_id, user_answer in submission.answers.items():
        question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if question and question.correct_option == user_answer:
            correct += 1
            score += 10 # Her doğru 10 puan
        else:
            wrong += 1
            
    # 2. VERİTABANINA KAYDET (YENİ KISIM) 💾
    new_attempt = models.ExamAttempt(
        user_id=current_user.id,
        skill_type=submission.skill_type,
        difficulty=submission.difficulty,
        score=score,
        total_questions=len(submission.answers),
        correct_count=correct
    )
    db.add(new_attempt)
    db.commit() # Kalıcı hale getir
    
    return {
        "score": score,
        "total_questions": len(submission.answers),
        "correct_count": correct,
        "wrong_count": wrong,
        "feedback": f"Tebrikler {current_user.full_name}, sonucun kaydedildi!"
    }