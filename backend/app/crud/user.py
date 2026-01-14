# Placeholder for CRUD operations if generic CRUD is not used
# For now, we can alias this to None or implement basic get/create
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create(db: Session, obj_in: UserCreate):
    db_obj = User(
        email=obj_in.email,
        password_hash=get_password_hash(obj_in.password),
        learning_purpose=obj_in.learning_purpose
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
