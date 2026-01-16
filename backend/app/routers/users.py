import json
import re  # AI yanıtını temizlemek için gerekli
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas, auth
from pydantic import BaseModel
from app.utils.email import send_verification_email  # 📧 Mail fonksiyonunu import ettik

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# --- VERİ MODELİ ---
class PurposeUpdate(BaseModel):
    purpose: str

# 1. KULLANICI BİLGİLERİNİ GETİR
@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    """Giriş yapmış kullanıcının bilgilerini döner."""
    return current_user

# 2. EMAIL DOĞRULAMA ENDPOINT
@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(database.get_db)):
    # Basitlik için token olarak e-posta adresi kullanıyoruz
    user = db.query(models.User).filter(models.User.email == token).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification link.")
    
    if user.is_verified:
        return {"message": "Email is already verified!"}

    user.is_verified = True
    db.commit()
    return {"message": "Email verified successfully! You can now login."}

# 3. İSTATİSTİK VE AI SEVİYE ANALİZİ (Geliştirildi 🚀)
@router.get("/stats")
def get_user_stats(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    attempts = db.query(models.ExamAttempt).filter(
        models.ExamAttempt.user_id == current_user.id
    ).order_by(models.ExamAttempt.id.desc()).all()

    if not attempts:
        return {
            "total_exams": 0, "avg_score": 0, "history": [],
            "level": "Unranked", "ai_analysis": "Complete your first exam to see analysis."
        }

    total_exams = len(attempts)
    avg_score = sum([a.score for a in attempts]) / total_exams

    # AI Analizi için veriyi hazırla
    recent_data = ""
    for a in attempts[:5]:
        recent_data += f"Skill: {a.skill_type}, Score: {a.score}\n"

    level_prompt = f"""
    Determine the CEFR level (A1-C2) for this student results:
    {recent_data}
    Goal: {current_user.learning_purpose}
    Output ONLY valid JSON: {{"level": "B1", "advice": "short advice"}}
    """
    
    try:
        from app.routers.exams import client 
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a CEFR expert. Output ONLY raw JSON. No text before or after."}, 
                {"role": "user", "content": level_prompt}
            ],
            temperature=0.1,
            max_tokens=150
        )
        
        content = response.choices[0].message.content.strip()
        
        # 🛡️ REGEX İLE JSON AYIKLAMA (Takılmayı önler)
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
            
        ai_res = json.loads(content)
        
    except Exception as e:
        print(f"❌ CRITICAL AI ERROR: {str(e)}")
        # Hata durumunda varsayılan değerler dönerek arayüzün kilitlenmesini engelleriz
        ai_res = {"level": "Calculating", "advice": "Continue practicing for a detailed analysis."}

    return {
        "total_exams": total_exams,
        "avg_score": round(avg_score, 1),
        "history": attempts,
        "level": ai_res.get("level", "B1"),
        "ai_analysis": ai_res.get("advice", "Keep practicing.")
    }

# 4. ÖĞRENME AMACINI GÜNCELLE
@router.post("/update-purpose")
def update_learning_purpose(
    request: PurposeUpdate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.learning_purpose = request.purpose
    db.commit()
    db.refresh(user)
    
    return {"message": "Learning purpose updated", "purpose": user.learning_purpose}

# 5. KAYIT OLMA (Email Gönderimi Eklendi 📧)
@router.post("/register", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        learning_purpose=user.learning_purpose,
        is_verified=False  # Yeni kullanıcılar onay bekliyor
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 📧 KAYIT SONRASI DOĞRULAMA MAİLİ GÖNDER
    try:
        send_verification_email(new_user.email, token=new_user.email)
        print(f"✅ Verification email triggered for {new_user.email}")
    except Exception as e:
        print(f"❌ Mail trigger error: {str(e)}")
        # Mail gitmese bile kullanıcı oluştuğu için hata fırlatmayabiliriz 
        # veya kullanıcıya bilgi verebiliriz.

    return new_user