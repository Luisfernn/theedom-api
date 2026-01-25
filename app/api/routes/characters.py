from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.characters import CharacterCreate, CharacterResponse
from app.services.character_service import create_character

router = APIRouter(prefix="/characters", tags=["Characters"])


@router.post(
    "",
    response_model=CharacterResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_character_endpoint(
    payload: CharacterCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_character(db, **payload.dict())
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )