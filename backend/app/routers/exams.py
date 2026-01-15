import os
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List, Optional
from openai import OpenAI  # Groq, OpenAI kütüphanesiyle çalışır
from dotenv import load_dotenv
from app import database, models, schemas, auth
 
# .env dosyasını yükle
load_dotenv()
 
router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)
 
# --- GROQ (LLAMA 3.3) BAĞLANTISI ---
# Not: Çok hızlı ve şu an için ücretsiz planda çalışıyor.
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)
 
# 1. SINAV BAŞLAT (GET /exams/start)
@router.get("/start", response_model=List[schemas.QuestionOut])
def start_exam(
    skill: str = "Vocabulary",
    level: Optional[str] = None,
    limit: int = 5,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    selected_level = level
 
    # Writing sınavı genellikle tek soru olur
    if skill == "Writing":
        limit = 1
 
    # --- DIAGNOSTIC ENGINE (TANI MOTORU) ---
    # Eğer kullanıcı seviye seçmediyse, sistem geçmişe bakıp karar verir.
    if selected_level is None:
        last_attempt = db.query(models.ExamAttempt)\
            .filter(models.ExamAttempt.user_id == current_user.id)\
            .filter(models.ExamAttempt.skill_type == skill)\
            .order_by(models.ExamAttempt.date_taken.desc())\
            .first()
        if not last_attempt:
            selected_level = "Easy" # İlk kez giriyorsa Kolay
        else:
            score = last_attempt.score
            if score >= 80: selected_level = "Hard"   # Başarılı -> Zorlaştır
            elif score >= 50: selected_level = "Medium" # Orta -> Koru
            else: selected_level = "Easy"   # Başarısız -> Kolaylaştır
    # Soruları Veritabanından Çek
    questions = db.query(models.Question)\
        .filter(models.Question.skill_type == skill)\
        .filter(models.Question.difficulty == selected_level)\
        .order_by(func.random())\
        .limit(limit)\
        .all()
    return questions
 
# --- YARDIMCI FONKSİYON: WRITING PUANLAMA (GROQ AI) ---
def grade_writing_with_groq(question_text, user_text):
    print("🤖 Groq (Llama 3.3) essay'i okuyor...")
    prompt = f"""
    You are an English Teacher grading an exam.
    Question: "{question_text}"
    Student Answer: "{user_text}"
    Task:
    1. Grade out of 100 based on grammar, vocabulary, and relevance.
    2. Provide a short feedback (max 1 sentence).
    Output Format: JSON ONLY.
    Example: {{"score": 85, "feedback": "Good job, but check your tenses."}}
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # <-- GÜNCELLENMİŞ YENİ MODEL
            messages=[
                {"role": "system", "content": "You are a strict grading assistant. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )
        content = response.choices[0].message.content.strip()
        # Temizlik (JSON dışında markdown gelirse temizle)
        if "```" in content:
            content = content.split("```")[1].replace("json", "").strip()
        result = json.loads(content)
        return result.get("score", 0), result.get("feedback", "No feedback provided.")
    except Exception as e:
        print(f"❌ Groq Hatası: {e}")
        # Hata olursa sistemi kilitleme, ortalama puan ver ve loga yaz
        return 60, "AI servisi şu an yanıt veremiyor. Puan geçici olarak verildi."
 
# 2. SINAV BİTİR VE PUANLA (POST /exams/submit)
@router.post("/submit", response_model=schemas.ExamResult)
def submit_exam(
    submission: schemas.ExamSubmit,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    total_score = 0
    correct = 0
    wrong = 0
    ai_feedback_list = []
    # Cevapları tek tek kontrol et
    for question_id, user_answer in submission.answers.items():
        question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if not question:
            continue
        # --- DURUM A: WRITING SORUSU (YAPAY ZEKA PUANLAR) ---
        if question.skill_type == "Writing" or question.correct_option == "AI_EVAL":
            score, feedback = grade_writing_with_groq(question.question_text, user_answer)
            total_score += score
            ai_feedback_list.append(feedback)
            # Writing'de 60 üstü geçer sayılır
            if score >= 60: correct += 1
            else: wrong += 1
        # --- DURUM B: TEST SORUSU (PYTHON KONTROL EDER) ---
        else:
            if question.correct_option == user_answer:
                correct += 1
                total_score += 20 # Soru başına puan (İsteğe göre değişebilir)
            else:
                wrong += 1
 
    # Sonucu Kaydet
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
    # Nihai Feedback Oluştur
    if ai_feedback_list:
        final_feedback = " | ".join(ai_feedback_list)
    else:
        if total_score >= 80: final_feedback = "Harika iş! 🎉"
        elif total_score >= 50: final_feedback = "İyi, ama daha çok çalışmalısın."
        else: final_feedback = "Konuyu tekrar etmelisin."
 
    return {
        "score": total_score,
        "total_questions": len(submission.answers),
        "correct_count": correct,
        "wrong_count": wrong,
        "feedback": f"{current_user.full_name}: {final_feedback}"
    }