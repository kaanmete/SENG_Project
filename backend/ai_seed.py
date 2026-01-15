import os
import json
from openai import OpenAI
from app.database import SessionLocal
from app import models
from dotenv import load_dotenv
 
# .env yükle (Localde çalışırken)
load_dotenv()
 
# Veritabanı ve Groq Bağlantısı
db = SessionLocal()
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)
 
# 🎯 HEDEFLER LİSTESİ (Ne kadar soru istiyorsun?)
# Buradaki sayıları (count) artırarak veritabanını şişirebilirsin.
TARGETS = [
    {"skill": "Vocabulary", "level": "Easy", "count": 20},
    {"skill": "Vocabulary", "level": "Medium", "count": 20},
    {"skill": "Vocabulary", "level": "Hard", "count": 20},
    {"skill": "Grammar", "level": "Easy", "count": 20},
    {"skill": "Grammar", "level": "Medium", "count": 20},
    {"skill": "Grammar", "level": "Hard", "count": 20},
    # Reading (Okuma Parçaları)
    {"skill": "Reading", "level": "Medium", "count": 10},
    {"skill": "Reading", "level": "Hard", "count": 10},
    # Writing (Yazma Konuları)
    {"skill": "Writing", "level": "Medium", "count": 10},
    {"skill": "Writing", "level": "Hard", "count": 10},
]
 
def generate_questions_with_groq(skill, level, count):
    print(f"🤖 Groq çalışıyor: {count} adet {level} {skill} sorusu isteniyor...")
    # Writing soruları için özel prompt (Şık yok, sadece konu var)
    if skill == "Writing":
        prompt = f"""
        Generate {count} unique essay writing prompts for English learners.
        Skill: Writing
        Difficulty: {level}
        Output Format: STRICT JSON list.
        Structure:
        [
          {{
            "question_text": "Write an essay about...",
            "options": {{}}, 
            "correct_option": "AI_EVAL"
          }}
        ]
        """
    else:
        # Test soruları için prompt (Şıklı)
        prompt = f"""
        Generate {count} unique multiple-choice English questions.
        Skill: {skill}
        Difficulty: {level}
        Output Format: STRICT JSON list ONLY. No intro text.
        Structure:
        [
          {{
            "question_text": "Question here...",
            "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
            "correct_option": "A"
          }}
        ]
        """
 
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # <-- İŞTE YENİ MODEL BU
            messages=[
                {"role": "system", "content": "You are a database seeder. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        content = response.choices[0].message.content.strip()
        # Temizlik
        if "```" in content:
            content = content.split("```")[1].replace("json", "").strip()
        return json.loads(content)
 
    except Exception as e:
        print(f"❌ Hata ({skill}-{level}): {e}")
        return []
 
def main():
    print("🚀 Groq ile veritabanı dolduruluyor...")
    total_added = 0
    for t in TARGETS:
        questions = generate_questions_with_groq(t["skill"], t["level"], t["count"])
        for q in questions:
            # Çift kayıt kontrolü
            exists = db.query(models.Question).filter(models.Question.question_text == q["question_text"]).first()
            if not exists:
                new_q = models.Question(
                    skill_type=t["skill"],
                    difficulty=t["level"],
                    question_text=q["question_text"],
                    options=q["options"],
                    correct_option=q["correct_option"]
                )
                db.add(new_q)
                total_added += 1
                print(f"   + Eklendi ({t['skill']}): {q['question_text'][:40]}...")
        db.commit() # Her kategori bitince kaydet
 
    print(f"\n✅ İŞLEM BİTTİ! Toplam {total_added} yeni soru Groq tarafından üretildi.")
    db.close()
 
if __name__ == "__main__":
    main()