from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    learning_purpose: Optional[str] = "general"

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDB(UserBase):
    id: int
    is_active: Boolean
    created_at: datetime
    
    class Config:
        from_attributes = True

class User(UserInDB):
    pass
