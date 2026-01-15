from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List, Optional
from app import database, models, schemas, auth

router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)

# --- 1. YENİ EKLENEN KAPI: TÜM SORULARI GETİR ---
# Frontend buradan tüm listeyi çekecek: /exams/all
@router.get("/all")
def get_all_questions(
    db: Session = Depends(database.get_db),
    # İstersen buraya user kontrolü ekleyebilirsin, şimdilik test için açık bırakalım
    # current_user: models.User = Depends(auth.get_current_user) 
):
    # Filtre yok, limit yok. Ne varsa getir!
    questions = db.query(models.Question).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="Veritabanında hiç soru yok.")
        
    return questions


# --- 2. ESKİ RASTGELE SINAV OLUŞTURUCU (Aynı kaldı) ---
# Burayı daha sonra spesifik sınavlar için kullanırız.
@router.get("/start", response_model=List[schemas.QuestionOut])
def start_exam(
    skill: Optional[str] = None, # Artık zorunlu değil
    level: Optional[str] = None,
    limit: int = 10,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Question)

    # Eğer Frontend özellikle bir konu isterse filtrele, istemezse filtreleme
    if skill:
        query = query.filter(models.Question.skill_type == skill)
    
    if level:
        query = query.filter(models.Question.difficulty == level)

    # Rastgele karıştır ve getir
    questions = query.order_by(func.random()).limit(limit).all()
    
    if not questions:
        # Hata fırlatmak yerine boş liste dönmek frontend'i çökertmez
        return [] 
        
    return questions


# --- 3. CEVAPLARI KONTROL ET (Aynı kaldı) ---
@router.post("/submit", response_model=schemas.ExamResult)
def submit_exam(
    submission: schemas.ExamSubmit,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    score = 0
    correct = 0
    wrong = 0
    
    for question_id, user_answer in submission.answers.items():
        question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if question and question.correct_option == user_answer:
            correct += 1
            score += 10
        else:
            wrong += 1
            
    # Sonucu Kaydet
    new_attempt = models.ExamAttempt(
        user_id=current_user.id,
        skill_type=submission.skill_type,
        difficulty=submission.difficulty,
        score=score,
        total_questions=len(submission.answers),
        correct_count=correct
    )
    db.add(new_attempt)
    db.commit()
    
    return {
        "score": score,
        "total_questions": len(submission.answers),
        "correct_count": correct,
        "wrong_count": wrong,
        "feedback": f"Tebrikler {current_user.full_name}, sonucun kaydedildi!"
    }