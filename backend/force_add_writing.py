from app.database import SessionLocal
from app.models import Question

# Veritabanı bağlantısı
db = SessionLocal()

# 15 Tane Garanti Writing Konusu
topics = [
    # Teknoloji & Toplum
    "Do you think social media brings people together or drives them apart? Explain your opinion.",
    "Discuss the advantages and disadvantages of artificial intelligence in our daily lives.",
    "Should children be allowed to own smartphones? Why or why not?",
    "How has the internet changed the way we learn/educate ourselves?",
    
    # İş & Eğitim
    "What are the pros and cons of remote working (working from home)?",
    "Should university education be free for everyone? Discuss.",
    "Is it better to work in a team or alone? Explain your preference.",
    "What is your dream job and why would you be good at it?",
    
    # Kişisel & Yaşam
    "Describe a person who has had a major influence on your life.",
    "Describe your favorite holiday destination and why you like it.",
    "What is the most important quality in a friend? Trust, humor, or intelligence?",
    "If you could live anywhere in the world, where would it be and why?",
    
    # Güncel Sorunlar
    "How can we solve the traffic problem in big cities?",
    "Do you think plastic bags should be completely banned to save the environment?",
    "Should public transport be free for everyone to reduce pollution?"
]

print("🚀 Veri ekleme işlemi başlıyor...")
added_count = 0

for text in topics:
    # 1. Önce bu soru zaten var mı diye kontrol et (Aynısını tekrar eklemeyelim)
    # Hem 'Writing' hem 'writing' olarak kontrol ediyoruz
    exists = db.query(Question).filter(Question.question_text == text).first()
    
    if not exists:
        new_q = Question(
            skill_type="Writing",  # Senin seed kodunda "Writing" (Büyük harf) kullanılmıştı
            difficulty="Medium",   # Hepsi şimdilik Medium olsun
            question_text=text,
            context_text=None,     # Writing'de metin yok
            options={},            # Şık yok
            correct_option=None    # Doğru şık yok
        )
        db.add(new_q)
        added_count += 1
        print(f" + Eklendi: {text[:40]}...")
    else:
        print(f" - Zaten var: {text[:40]}...")

db.commit()
print(f"\n✅ İşlem Tamamlandı! Toplam {added_count} yeni soru eklendi.")
print("Şimdi Writing sayfasına gidip 'Yeni Konu Dene' butonuna basabilirsin.")

db.close()