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
        print(f"❌ Groq Error: {e}")
        return None

def main():
    print("🕵️‍♂️ Missing Reading passages are being sought...")
    
    # Retrieve Reading questions from the database where context_text is EMPTY.
    broken_questions = db.query(models.Question)\
        .filter(models.Question.skill_type == "Reading")\
        .filter((models.Question.context_text == None) | (models.Question.context_text == ""))\
        .all()
    
    if not broken_questions:
        print("🎉 Great! No missing questions found to fix.")
        return

    print(f"⚠️ A total of {len(broken_questions)} questions without paragraphs were found. Repairs are starting...\n")

    count = 0
    for q in broken_questions:
        # Find the text of the correct answer (e.g., if the answer is "B", take the word "London" from within "B")
        correct_option_key = q.correct_option # "A", "B", "C" vb.
        correct_answer_text = q.options.get(correct_option_key, "")
        
        if not correct_answer_text:
            print(f"⏭️ Question ID {q.id} passed (Correct answer text not found).")
            continue

        print(f"🔨 Repairing: {q.question_text[:30]}... (Answer: {correct_answer_text})")
        
        # Groq'a paragraf yazdır
        new_context = generate_context_for_question(q.question_text, correct_answer_text)
        
        if new_context:
            # Veritabanını güncelle
            q.context_text = new_context
            db.commit() # Kaydet
            count += 1
            print(f"   ✅ Paragraph added: {new_context[:40]}...")
        else:
            print("    ❌ AI could not respond.")

    print(f"\n🏁 OPERATION COMPLETE! {count} questions recovered and updated.")
    db.close()

if __name__ == "__main__":
    main()
