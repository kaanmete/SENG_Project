import json
from openai import OpenAI
from app.core.config import settings
from typing import List, Dict, Any

class AIService:
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            print("WARNING: OPENAI_API_KEY not found. AI features disabled.")

    def _check_client(self):
        if not self.client:
            raise Exception("AI features are not available (Missing API Key)")

    def generate_adaptive_question(self, skill_type: str, difficulty_level: int, user_purpose: str) -> Dict[str, Any]:
        self._check_client()
        cefr_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1', 6: 'C2'}
        cefr = cefr_map.get(difficulty_level, 'B1')
        
        prompt = f"""Generate a {skill_type} question at CEFR {cefr} level for someone learning English for {user_purpose}.
        Return ONLY valid JSON format:
        {{
            "question": "Question text",
            "options": {{"A": "opt1", "B": "opt2", "C": "opt3", "D": "opt4"}},
            "correct_answer": "A",
            "explanation": "Why A is correct"
        }}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an English assessment expert. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        return json.loads(response.choices[0].message.content)

    def analyze_response(self, question: str, user_answer: str, correct_answer: str) -> Dict[str, Any]:
        self._check_client()
        prompt = f"""Analyze this response.
        Question: {question}
        User Answer: {user_answer}
        Correct Answer: {correct_answer}
        
        Return ONLY JSON:
        {{
            "is_correct": boolean,
            "score": 0.0 to 1.0,
            "feedback": "Detailed feedback"
        }}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an English tutor. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return json.loads(response.choices[0].message.content)

ai_service = AIService()
