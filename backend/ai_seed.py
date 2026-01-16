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

# 🎯 HEDEFLER LİSTESİ
TARGETS = [
    {"skill": "Vocabulary", "level": "Easy", "count": 10},
    {"skill": "Vocabulary", "level": "Medium", "count": 10},
    {"skill": "Grammar", "level": "Easy", "count": 10},
    {"skill": "Grammar", "level": "Medium", "count": 10},
    # Reading (Artık context_text ile gelecek!)
    {"skill": "Reading", "level": "Medium", "count": 10},
    {"skill": "Reading", "level": "Hard", "count": 10},
    # Writing
    {"skill": "Writing", "level": "Medium", "count": 5},
    {"skill": "Writing", "level": "Hard", "count": 5},
]

def generate_questions_with_groq(skill, level, count):
    print(f"🤖 Groq çalışıyor: {count} adet {level} {skill} sorusu isteniyor...")
    
    # 1. WRITING SENARYOSU
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
            "correct_option": "AI_EVAL",
            "context_text": null
          }}
        ]
        """
    
    # 2. READING SENARYOSU (YENİ EKLENEN KISIM) 📚
    elif skill == "Reading":
        prompt = f"""
        Generate {count} unique reading comprehension questions.
        Skill: Reading
        Difficulty: {level}
        
        Crucial: You MUST provide a short reading passage (50-100 words) for EACH question in the 'context_text' field.
        
        Output Format: STRICT JSON list.
        Structure:
        [
          {{
            "context_text": "London is the capital of England...",
            "question_text": "What is the capital of England?",
            "options": {{"A": "Paris", "B": "London", "C": "Berlin", "D": "Rome"}},
            "correct_option": "B"
          }}
        ]
        """

    # 3. STANDART TEST (VOCABULARY / GRAMMAR)
    else:
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
            "correct_option": "A",
            "context_text": null
          }}
        ]
        """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
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
                # context_text alanını güvenli bir şekilde al (yoksa None olsun)
                context = q.get("context_text", None)
                
                new_q = models.Question(
                    skill_type=t["skill"],
                    difficulty=t["level"],
                    question_text=q["question_text"],
                    context_text=context, # <-- BURASI ARTIK DOLU GELECEK
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