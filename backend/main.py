from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app import models, schemas, auth, database
from app.routers import exams # <-- EKLENDİ
from fastapi.security import OAuth2PasswordRequestForm
from app.routers import exams, stats # <-- stats EKLENDİ

# 1. Veritabanı Tablolarını Oluştur (Eğer yoksa)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI() 
app.include_router(exams.router) # <-- EKLENDİ
app.include_router(stats.router) # <-- EKLENDİ

# 👇 GÜNCELLENECEK KISIM BURASI 👇
origins = [
    "http://localhost:3000",      # Frontend'in yerel adresi
    "http://127.0.0.1:3000",      # Bazen localhost yerine bu kullanılır
    "*"                           # Diğer tüm adresler (Yedek olarak kalsın)
]

# 2. CORS Ayarları (Frontend'in Backend'e erişmesi için izin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Güvenlik için production'da spesifik domain yazılır
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Veritabanı bağlantısı al
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API UÇLARI (ENDPOINTS) ---

@app.get("/")
def read_root():
    return {"message": "SENG Project Backend Çalışıyor! 🚀"}

# 1. KULLANICI KAYDI (REGISTER)
@app.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Email var mı kontrol et
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı!")
    
    # Şifreyi hashle
    hashed_password = auth.get_password_hash(user.password)
    
    # YENİ KULLANICI OLUŞTUR (GÜNCELLENMİŞ HALİ)
    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        learning_purpose=user.learning_purpose,
        role="user"  # <--- İŞTE BU SATIRI EKLEDİK (Unutulan parça buydu)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# 2. GİRİŞ YAP (LOGIN)
@app.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Kullanıcıyı bul (Swagger 'username' gönderir, biz onu 'email' olarak kullanırız)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    # Kullanıcı yoksa veya şifre yanlışsa
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hatalı email veya şifre",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Token oluştur
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}