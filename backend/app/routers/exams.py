import os
import json
import random 
import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from sqlalchemy import or_ # Filtreleme için eklendi
from typing import List, Optional
from pydantic import BaseModel
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

# --- VERİ MODELLERİ ---
class WritingRequest(BaseModel):
    topic: str
    text: str

class HintRequest(BaseModel):
    question_text: str
    options: dict

# --- YARDIMCI FONKSİYONLAR ---

def grade_writing_with_groq(topic, user_text):
    prompt = f"""
    You are an English Teacher.
    Topic: "{topic}"
    Student Essay: "{user_text}"
    Task:
    1. Grade out of 100 based on grammar, vocabulary, and coherence.
    2. Provide a short, constructive feedback (max 2 sentences).
    Output Format: JSON ONLY.
    Example: {{"score": 85, "feedback": "Good vocabulary..."}}
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
        if "```" in content:
            content = content.split("```")[1].replace("json", "").strip()
        result = json.loads(content)
        return result.get("score", 0), result.get("feedback", "No feedback available.")
    except Exception as e:
        return 0, "AI service unavailable."

def analyze_mistakes_with_groq(skill_type, mistakes, purpose="General"):
    if not mistakes:
        return f"Perfect! You have mastered the concepts in this {skill_type} session. 🎉"

    mistakes_text = ""
    for idx, m in enumerate(mistakes):
        mistakes_text += f"{idx+1}. Question: {m['question']}\n   Correct: {m['correct_answer']}\n"

    # AI Analizine kullanıcının amacını da ekledik
    prompt = f"""
    You are an AI English Tutor. A student with the learning goal of "{purpose}" finished a {skill_type} exam.
    Mistakes:
    {mistakes_text}
    TASK: Provide a SHORT (max 3 sentences) personalized advice paragraph. 
    Explain what concepts they need to improve, keeping their goal "{purpose}" in mind.
    Directly address the student (use "You").
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": "You are a helpful English tutor."}, {"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return "Keep practicing to improve your skills!"

def generate_hint_with_groq(question_text, options):
    prompt = f"""
    Question: "{question_text}"
    Options: {json.dumps(options)}
    Provide a VERY SHORT hint (max 15 words) without giving the answer.
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": "Give clues, not answers."}, {"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=50
        )
        return response.choices[0].message.content.strip()
    except:
        return "Look closely at the keywords!"

# --- ENDPOINTLER ---

@router.get("/writing-topic")
def get_random_writing_topic(db: Session = Depends(database.get_db)):
    topics = db.query(models.Question).filter(models.Question.skill_type == "Writing").all()
    if not topics: return {"topic": "Describe your daily routine."}
    return {"topic": random.choice(topics).question_text}

@router.post("/evaluate-writing")
def evaluate_writing(request: WritingRequest):
    score, feedback = grade_writing_with_groq(request.topic, request.text)
    return {"score": score, "feedback": feedback}

@router.post("/get-hint")
def get_hint_endpoint(request: HintRequest):
    return {"hint": generate_hint_with_groq(request.question_text, request.options)}

@router.get("/count-tests")
def get_test_counts(skill: str, level: Optional[str] = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Question).filter(models.Question.skill_type == skill)
    if level: query = query.filter(models.Question.difficulty == level)
    total_questions = query.count()
    total_tests = math.ceil(total_questions / 10)
    return {"total_questions": total_questions, "total_tests": total_tests if total_tests > 0 else 1}

@router.get("/get-test-questions")
def get_test_questions(skill: str, test_number: int, db: Session = Depends(database.get_db)):
    questions_per_page = 10
    skip_amount = (test_number - 1) * questions_per_page
    return db.query(models.Question).filter(models.Question.skill_type == skill).order_by(models.Question.id).offset(skip_amount).limit(questions_per_page).all()

@router.get("/all")
def get_all_questions(db: Session = Depends(database.get_db)):
    return db.query(models.Question).all() or []

# 🚀 GÜNCELLENEN AMAÇ ODAKLI MIXED EXAM
@router.get("/start-mixed", response_model=List[schemas.QuestionOut])
def start_mixed_exam(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    skills = ["Vocabulary", "Grammar", "Reading", "Listening"]
    final_questions = []

    # Amaca göre anahtar kelimeler
    purpose = current_user.learning_purpose.lower() if current_user.learning_purpose else "general"
    purpose_map = {
        "business": ["meeting", "office", "report", "professional", "company", "client", "market", "manager", "work"],
        "exam preparation": ["research", "university", "scientific", "study", "exam", "professor", "theory", "evidence"],
        "travel": ["airport", "hotel", "tourist", "ticket", "restaurant", "city", "flight", "booking", "travel"],
        "hobby": ["movie", "game", "hobby", "music", "sport", "fun", "friend", "book", "entertainment"]
    }
    keywords = purpose_map.get(purpose, [])

    for skill in skills:
        skill_questions = []
        
        # Her zorluk seviyesi için (2 Easy, 2 Medium, 1 Hard)
        for diff, limit in [("Easy", 2), ("Medium", 2), ("Hard", 1)]:
            query = db.query(models.Question).filter(
                models.Question.skill_type == skill, 
                models.Question.difficulty == diff
            )

            current_difficulty_questions = []

            # 🎯 1. Seçenek: Amaca uygun soruları ara
            if keywords:
                keyword_filters = [models.Question.question_text.icontains(kw) for kw in keywords]
                keyword_filters += [models.Question.context_text.icontains(kw) for kw in keywords]
                
                purpose_questions = query.filter(or_(*keyword_filters)).order_by(func.random()).limit(limit).all()
                current_difficulty_questions.extend(purpose_questions)

            # 🎯 2. Seçenek: Eksik kalanları rastgele genel sorularla tamamla
            needed = limit - len(current_difficulty_questions)
            if needed > 0:
                selected_ids = [q.id for q in current_difficulty_questions]
                general_questions = query.filter(models.Question.id.notin_(selected_ids)).order_by(func.random()).limit(needed).all()
                current_difficulty_questions.extend(general_questions)
            
            skill_questions.extend(current_difficulty_questions)

        final_questions.extend(skill_questions)

    random.shuffle(final_questions)
    if not final_questions:
        raise HTTPException(status_code=404, detail="No questions found.")
    return final_questions

@router.post("/submit", response_model=schemas.ExamResult)
def submit_exam(
    submission: schemas.ExamSubmit,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    total_score, correct, wrong = 0, 0, 0
    mistakes_list = [] 
    for question_id, user_answer in submission.answers.items():
        question = db.query(models.Question).filter(models.Question.id == question_id).first()
        if not question: continue
        if question.correct_option == user_answer:
            correct += 1
            total_score += 10 
        else:
            wrong += 1
            mistakes_list.append({
                "question": question.question_text,
                "wrong_answer": question.options.get(user_answer, user_answer),
                "correct_answer": question.options.get(question.correct_option, "Unknown")
            })

    # Feedback'i kullanıcının amacına göre kişiselleştirdik
    ai_feedback_text = analyze_mistakes_with_groq(
        submission.skill_type, 
        mistakes_list, 
        purpose=current_user.learning_purpose or "General"
    )
    
    new_attempt = models.ExamAttempt(
        user_id=current_user.id, skill_type=submission.skill_type,
        difficulty=submission.difficulty, score=total_score,
        total_questions=len(submission.answers), correct_count=correct
    )
    db.add(new_attempt)
    db.commit()
    
    return {
        "score": total_score, "total_questions": len(submission.answers),
        "correct_count": correct, "wrong_count": wrong, "feedback": ai_feedback_text
    }