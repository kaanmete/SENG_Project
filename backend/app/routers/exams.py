import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List, Optional
from pydantic import BaseModel # <-- EKLENDİ
from openai import OpenAI
from dotenv import load_dotenv
from app import database, models, schemas, auth

# .env dosyasını yükle
load_dotenv()

router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)

# --- GROQ İSTEMCİSİ ---
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# --- YENİ: WRITING İÇİN VERİ MODELİ ---
class WritingRequest(BaseModel):
    topic: str
    text: str

# --- YARDIMCI FONKSİYON: GROQ İLE PUANLAMA ---
def grade_writing_with_groq(topic, user_text):
    print("🤖 Groq essay'i değerlendiriyor...")
    prompt = f"""
    You are an English Teacher.
    Topic: "{topic}"
    Student Essay: "{user_text}"
    
    Task:
    1. Grade out of 100 based on grammar, vocabulary, and coherence.
    2. Provide a short, constructive feedback (max 2 sentences).
    
    Output Format: JSON ONLY.
    Example: {{"score": 85, "feedback": "Good vocabulary, but watch out for run-on sentences."}}
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a grading assistant. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )
        content = response.choices[0].message.content.strip()
        
        # Markdown temizliği (Bazen ```json ... ``` şeklinde döner)
        if "```" in content:
            content = content.split("```")[1].replace("json", "").strip()
            
        result = json.loads(content)
        return result.get("score", 0), result.get("feedback", "Yorum yapılamadı.")
    except Exception as e:
        print(f"❌ Groq Hatası: {e}")
        return 0, "Yapay zeka servisine ulaşılamadı."

# ---------------------------------------------------------
# 1. WRITING DEĞERLENDİRME (POST /exams/evaluate-writing)
# ---------------------------------------------------------
@router.post("/evaluate-writing")
def evaluate_writing(request: WritingRequest):
    # Yukarıdaki yardımcı fonksiyonu kullan
    score, feedback = grade_writing_with_groq(request.topic, request.text)
    return {"score": score, "feedback": feedback}

# ---------------------------------------------------------
# 2. TÜM SORULARI GETİR (GET /exams/all)
# ---------------------------------------------------------
# Exam.js dosyasının doğru çalışması için bu gereklidir!
@router.get("/all")
def get_all_questions(db: Session = Depends(database.get_db)):
    questions = db.query(models.Question).all()
    if not questions:
        # Boş liste dön, hata fırlatma (Frontend yönetir)
        return []
    return questions

# ---------------------------------------------------------
# 3. ESKİ SINAV BAŞLATMA (GET /exams/start)
# ---------------------------------------------------------
@router.get("/start", response_model=List[schemas.QuestionOut])
def start_exam(
    skill: str = "Vocabulary",
    level: Optional[str] = None,
    limit: int = 5,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    selected_level = level

    if skill == "Writing":
        limit = 1

    # Otomatik Seviye Belirleme (Diagnostic)
    if selected_level is None:
        last_attempt = db.query(models.ExamAttempt)\
            .filter(models.ExamAttempt.user_id == current_user.id)\
            .filter(models.ExamAttempt.skill_type == skill)\
            .order_by(models.ExamAttempt.date_taken.desc())\
            .first()
        if not last_attempt:
            selected_level = "Easy"
        else:
            score = last_attempt.score
            if score >= 80: selected_level = "Hard"
            elif score >= 50: selected_level = "Medium"
            else: selected_level = "Easy"

    questions = db.query(models.Question)\
        .filter(models.Question.skill_type == skill)\
        .filter(models.Question.difficulty == selected_level)\
        .order_by(func.random())\
        .limit(limit)\
        .all()
    
    return questions

# ---------------------------------------------------------
# 4. TEST SINAVI SONUCU KAYDET (POST /exams/submit)
# ---------------------------------------------------------
@router.post("/submit", response_model=schemas.ExamResult)
def submit_exam(
    submission: schemas.ExamSubmit,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    total_score = 0
    correct = 0
    wrong = 0
    
    for question_id, user_answer in submission.answers.items():
        question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if not question:
            continue
            
        # Normal Test Sorusu Kontrolü
        if question.correct_option == user_answer:
            correct += 1
            total_score += 10 # Her soru 10 puan
        else:
            wrong += 1

    # Veritabanına Kaydet
    new_attempt = models.ExamAttempt(
        user_id=current_user.id,
        skill_type=submission.skill_type,
        difficulty=submission.difficulty,
        score=total_score,
        total_questions=len(submission.answers),
        correct_count=correct
    )
    db.add(new_attempt)
    db.commit()

    return {
        "score": total_score,
        "total_questions": len(submission.answers),
        "correct_count": correct,
        "wrong_count": wrong,
        "feedback": f"Sınav tamamlandı. Puanın: {total_score}"
    }