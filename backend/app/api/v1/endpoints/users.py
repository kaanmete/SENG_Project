from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.user import User, UserUpdate
from app.crud import user as crud_user # Need to implement CRUD or just inline it for MVP

router = APIRouter()

@router.get("/me", response_model=User)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me/purpose", response_model=User)
def update_learning_purpose(
    *,
    db: Session = Depends(deps.get_db),
    purpose: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update learning purpose.
    """
    current_user.learning_purpose = purpose
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
