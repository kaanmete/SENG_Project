import os
import json
import psycopg2
from dotenv import load_dotenv

# 1. Bağlantı Ayarları
load_dotenv()
DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    print("❌ HATA: .env dosyasında DATABASE_URL bulunamadı!")
    exit()

# 2. HAZIR SORU BANKASI (GENİŞLETİLMİŞ VERSİYON)
# Bu liste API'ye ihtiyaç duymadan veritabanını doldurur.
ALL_QUESTIONS = [
    # ---------------------------------------------------------
    # 1. VOCABULARY (KELİME BİLGİSİ)
    # ---------------------------------------------------------
    {
        "skill": "vocabulary", "diff": "Easy",
        "q": "My brother's daughter is my ______.",
        "opt": {"A": "niece", "B": "nephew", "C": "cousin", "D": "aunt"},
        "cor": "A", "exp": "The daughter of one's brother or sister is called a niece."
    },
    {
        "skill": "vocabulary", "diff": "Easy",
        "q": "Which word is the opposite of 'Ancient'?",
        "opt": {"A": "Old", "B": "Modern", "C": "Antique", "D": "Dusty"},
        "cor": "B", "exp": "Ancient means very old; Modern means relating to the present times."
    },
    {
        "skill": "vocabulary", "diff": "Medium",
        "q": "The meeting was ______ because the manager was sick.",
        "opt": {"A": "called off", "B": "called in", "C": "called out", "D": "called up"},
        "cor": "A", "exp": "'Call off' is a phrasal verb meaning to cancel an event."
    },
    {
        "skill": "vocabulary", "diff": "Medium",
        "q": "He is very ______; he always wants to be successful.",
        "opt": {"A": "lazy", "B": "ambitious", "C": "shy", "D": "rude"},
        "cor": "B", "exp": "Ambitious describes someone who has a strong desire and determination to succeed."
    },
    {
        "skill": "vocabulary", "diff": "Hard",
        "q": "The scientist's theory was ______, lacking any substantial evidence.",
        "opt": {"A": "groundbreaking", "B": "plausible", "C": "conjecture", "D": "empirical"},
        "cor": "C", "exp": "Conjecture refers to an opinion or conclusion formed on the basis of incomplete information."
    },
    {
        "skill": "vocabulary", "diff": "Hard",
        "q": "To ______ the problem, we need to look at the root causes.",
        "opt": {"A": "exacerbate", "B": "ameliorate", "C": "ignore", "D": "imply"},
        "cor": "B", "exp": "Ameliorate means to make something bad or unsatisfactory better."
    },

    # ---------------------------------------------------------
    # 2. GRAMMAR (DİL BİLGİSİ)
    # ---------------------------------------------------------
    {
        "skill": "grammar", "diff": "Easy",
        "q": "She ______ to the gym every Monday.",
        "opt": {"A": "go", "B": "going", "C": "goes", "D": "gone"},
        "cor": "C", "exp": "For third-person singular (She) in Present Simple, we add -es to 'go'."
    },
    {
        "skill": "grammar", "diff": "Easy",
        "q": "There aren't ______ apples left in the basket.",
        "opt": {"A": "some", "B": "any", "C": "much", "D": "a little"},
        "cor": "B", "exp": "We use 'any' in negative sentences with countable nouns."
    },
    {
        "skill": "grammar", "diff": "Medium",
        "q": "I have been living in London ______ 2010.",
        "opt": {"A": "for", "B": "since", "C": "ago", "D": "until"},
        "cor": "B", "exp": "We use 'since' with a specific point in time (2010) in Perfect Continuous tenses."
    },
    {
        "skill": "grammar", "diff": "Medium",
        "q": "If I ______ the answer, I would tell you.",
        "opt": {"A": "know", "B": "knew", "C": "had known", "D": "have known"},
        "cor": "B", "exp": "Second Conditional uses Past Simple (knew) for hypothetical situations in the present."
    },
    {
        "skill": "grammar", "diff": "Hard",
        "q": "Not only ______ the car, but he also broke the window.",
        "opt": {"A": "he stole", "B": "did he steal", "C": "he did steal", "D": "stole he"},
        "cor": "B", "exp": "After 'Not only', we use inversion (auxiliary verb + subject)."
    },
    {
        "skill": "grammar", "diff": "Hard",
        "q": "By this time next year, I ______ my degree.",
        "opt": {"A": "will finish", "B": "will have finished", "C": "have finished", "D": "finish"},
        "cor": "B", "exp": "Future Perfect (will have + V3) is used for actions that will be completed before a specific future time."
    },

    # ---------------------------------------------------------
    # 3. READING (OKUMA)
    # ---------------------------------------------------------
    {
        "skill": "reading", "diff": "Easy",
        "context": "Sarah loves weekends. On Saturdays, she goes to the park with her dog, Max. Max loves to run and catch balls. On Sundays, Sarah visits her grandmother and they bake cookies together.",
        "q": "What does Sarah do on Sundays?",
        "opt": {"A": "Goes to the park", "B": "Plays with Max", "C": "Bakes cookies", "D": "Goes to school"},
        "cor": "C", "exp": "The text explicitly states: 'On Sundays, Sarah visits her grandmother and they bake cookies together.'"
    },
    {
        "skill": "reading", "diff": "Medium",
        "context": "The concept of 'Greenwashing' refers to companies marketing themselves as environmentally friendly without actually implementing sustainable practices. This deceptive tactic is used to appeal to eco-conscious consumers.",
        "q": "What is the main purpose of 'Greenwashing'?",
        "opt": {"A": "To actually save the environment", "B": "To deceive consumers for profit", "C": "To clean factories", "D": "To reduce taxes"},
        "cor": "B", "exp": "The text describes it as a 'deceptive tactic' to 'appeal to eco-conscious consumers' without real action."
    },
    {
        "skill": "reading", "diff": "Hard",
        "context": "Quantum entanglement is a phenomenon where particles become interconnected such that the state of one cannot be described independently of the other, even when separated by large distances. Einstein famously referred to this as 'spooky action at a distance'.",
        "q": "Why did Einstein call it 'spooky action at a distance'?",
        "opt": {"A": "Because it involved ghosts", "B": "Because the particles were scary", "C": "Because the connection persisted over vast distances instantly", "D": "Because he didn't understand math"},
        "cor": "C", "exp": "It refers to the instantaneous connection between particles regardless of the distance separating them."
    },

    # ---------------------------------------------------------
    # 4. LISTENING (DİNLEME SİMÜLASYONU)
    # Not: Gerçek app'te burada ses dosyası URL'i olur. Şimdilik metni (Script) koyuyoruz.
    # ---------------------------------------------------------
    {
        "skill": "listening", "diff": "Easy",
        "context": "[AUDIO SCRIPT]: Passenger: Excuse me, does this bus go to the city center? Driver: No, you need the number 5. This is number 12.",
        "q": "Which bus does the passenger need?",
        "opt": {"A": "Number 12", "B": "Number 5", "C": "Number 10", "D": "Number 1"},
        "cor": "B", "exp": "The driver explicitly says: 'No, you need the number 5.'."
    },
    {
        "skill": "listening", "diff": "Medium",
        "context": "[AUDIO SCRIPT]: Welcome to the museum. Please remember that taking photos with flash is prohibited inside the gallery. You can leave your bags in the lockers on the left.",
        "q": "What is forbidden inside the gallery?",
        "opt": {"A": "Entering with bags", "B": "Talking loudly", "C": "Taking photos with flash", "D": "Walking fast"},
        "cor": "C", "exp": "The announcement states: 'taking photos with flash is prohibited'."
    },

    # ---------------------------------------------------------
    # 5. WRITING (YAZMA)
    # Not: Writing sorularında şık (options) olmaz, AI değerlendirmesi gerekir.
    # ---------------------------------------------------------
    {
        "skill": "writing", "diff": "Medium",
        "q": "Write a short paragraph (50-80 words) describing your favorite holiday destination. Explain why you like it.",
        "opt": None,  # Writing'de şık yok
        "cor": None,
        "exp": "AI will evaluate grammar, vocabulary range, and relevance to the topic."
    },
    {
        "skill": "writing", "diff": "Hard",
        "q": "Some people believe that technology makes us less social. Do you agree or disagree? Write an essay supporting your opinion (min. 150 words).",
        "opt": None,
        "cor": None,
        "exp": "AI will look for structure (intro, body, conclusion), coherence, and argumentation."
    }
]

def populate_manual():
    print(f"🚀 Veritabanı Doldurma İşlemi Başlıyor...")
    print(f"📦 Toplam {len(ALL_QUESTIONS)} adet soru hazırlanıyor...")
    
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Önce eski soruları temizleyelim mi? (İsteğe bağlı, temiz sayfa için iyi olur)
        # cur.execute("TRUNCATE TABLE questions RESTART IDENTITY CASCADE;") 
        
        inserted_count = 0
        for data in ALL_QUESTIONS:
            cur.execute("""
                INSERT INTO questions (skill_type, difficulty, question_text, context_text, options, correct_option, explanation)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                data['skill'], 
                data['diff'], 
                data['q'], 
                data.get('context'), # Varsa context, yoksa None
                json.dumps(data['opt']) if data['opt'] else None, # Writing için None
                data['cor'], 
                data['exp']
            ))
            inserted_count += 1
            
        conn.commit()
        cur.close()
        conn.close()
        print(f"\n✅ İŞLEM TAMAMLANDI!")
        print(f"🏆 Başarıyla {inserted_count} soru yüklendi.")
        print("💡 Artık veritabanın backend testleri için tamamen hazır.")
        
    except Exception as e:
        print(f"\n❌ HATA OLUŞTU: {e}")

if __name__ == "__main__":
    populate_manual()