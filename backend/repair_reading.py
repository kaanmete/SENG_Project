import os
import json
from openai import OpenAI
from app.database import SessionLocal
from app import models
from dotenv import load_dotenv

load_dotenv()

db = SessionLocal()
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def generate_context_for_question(question_text, correct_answer_text):
    """
    It takes the question and the correct answer and produces a reading passage accordingly.
    """
    prompt = f"""
    Write a short reading passage (50-80 words) in English.
    
    Constraint 1: The passage must contain the answer to the question: "{question_text}"
    Constraint 2: The correct answer is "{correct_answer_text}". Ensure this information is clearly stated in the text.
    Constraint 3: Do not write "The answer is...". Just write a natural story or article.
    
    Output: Just the paragraph text. Nothing else.
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an English textbook writer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"❌ Groq Hatası: {e}")
        return None

def main():
    print("🕵️‍♂️ Eksik Reading parçaları aranıyor...")
    
    # Veritabanından context_text'i BOŞ olan Reading sorularını çek
    broken_questions = db.query(models.Question)\
        .filter(models.Question.skill_type == "Reading")\
        .filter((models.Question.context_text == None) | (models.Question.context_text == ""))\
        .all()
    
    if not broken_questions:
        print("🎉 Harika! Tamir edilecek eksik soru bulunamadı.")
        return

    print(f"⚠️ Toplam {len(broken_questions)} adet paragrafsız soru bulundu. Tamirat başlıyor...\n")

    count = 0
    for q in broken_questions:
        # Doğru şıkkın metnini bul (Örn: "B" şıkkı ise, B'nin içindeki "London" yazısını al)
        correct_option_key = q.correct_option # "A", "B", "C" vb.
        correct_answer_text = q.options.get(correct_option_key, "")
        
        if not correct_answer_text:
            print(f"⏭️ Soru ID {q.id} geçildi (Doğru cevap metni bulunamadı).")
            continue

        print(f"🔨 Tamir ediliyor: {q.question_text[:30]}... (Cevap: {correct_answer_text})")
        
        # Groq'a paragraf yazdır
        new_context = generate_context_for_question(q.question_text, correct_answer_text)
        
        if new_context:
            # Veritabanını güncelle
            q.context_text = new_context
            db.commit() # Kaydet
            count += 1
            print(f"   ✅ Paragraf eklendi: {new_context[:40]}...")
        else:
            print("   ❌ AI yanıt veremedi.")

    print(f"\n🏁 İŞLEM TAMAMLANDI! {count} adet soru kurtarıldı ve güncellendi.")
    db.close()

if __name__ == "__main__":
    main()
