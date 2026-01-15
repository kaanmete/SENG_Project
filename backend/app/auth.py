from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Ayarları .env dosyasından al
# Ayarları .env dosyasından al (Bulamazsa varsayılanları kullan)
SECRET_KEY = os.getenv("SECRET_KEY", "cok_gizli_varsayilan_anahtar_123")
ALGORITHM = os.getenv("ALGORITHM", "HS256") # <-- ARTIK GARANTİ ÇALIŞACAK
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Şifreleme Yöneticisi
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 1. Şifreyi Doğrula (Girilen şifre ile veritabanındaki hash aynı mı?)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 2. Şifreyi Hash'le (Kaydederken şifreyi karıştır)
def get_password_hash(password):
    return pwd_context.hash(password)

# 3. Token Oluştur (Giriş Bileti)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- BUNU EN ALTA EKLE ---
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app import database, models
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Giriş yapmanız gerekiyor",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user