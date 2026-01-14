from sqlalchemy.orm import Session
from app.models.exam import Exam
from app.models.question import Question
from app.models.response import Response
from app.schemas.exam import ExamCreate # We need to create this schema
from app.services.ai_service import ai_service
from datetime import datetime

class ExamService:
    def create_exam(self, db: Session, user_id: int, exam_type: str) -> Exam:
        exam = Exam(user_id=user_id, exam_type=exam_type, start_time=datetime.now())
        db.add(exam)
        db.commit()
        db.refresh(exam)
        return exam

    def get_next_question(self, db: Session, exam_id: int, user_purpose: str = "general") -> Question:
        # Simple adaptive logic: Get last response, check correctness, adjust difficulty
        # For MVP, we might generate on the fly using AI Service
        
        # 1. Determine difficulty (mock logic for now)
        difficulty = 3 # B1
        
        # 2. Generate content
        q_data = ai_service.generate_adaptive_question("grammar", difficulty, user_purpose)
        
        # 3. Save to DB
        question = Question(
            type="grammar",
            difficulty_level=difficulty,
            content=q_data["question"],
            options=q_data["options"],
            correct_answer=q_data["correct_answer"],
            explanation=q_data["explanation"]
        )
        db.add(question)
        db.commit()
        db.refresh(question)
        return question

    def submit_answer(self, db: Session, exam_id: int, question_id: int, user_answer: str):
        # 1. Get question
        question = db.query(Question).filter(Question.id == question_id).first()
        
        # 2. Analyze
        analysis = ai_service.analyze_response(question.content, user_answer, question.correct_answer)
        
        # 3. Save Response
        response = Response(
            exam_id=exam_id,
            question_id=question_id,
            user_answer=user_answer,
            is_correct=analysis["is_correct"],
            score=analysis["score"],
            feedback=analysis["feedback"]
        )
        db.add(response)
        db.commit()
        return response

exam_service = ExamService()
