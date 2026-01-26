from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.characters import CharacterCreate, CharacterResponse
from app.services.character_service import create_character, get_character_by_id

router = APIRouter(prefix="/characters", tags=["Characters"])


@router.post(
    "",
    response_model=CharacterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar um novo personagem",
    description="Cria um novo personagem vinculado a uma série e opcionalmente a um ator. Valida que a série e o ator (se fornecido) existem.",
)
def create_character_endpoint(
    payload: CharacterCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_character(
            db,
            name=payload.name,
            series_id=payload.series_id,
            actor_id=payload.actor_id,
            role_type=payload.role_type
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/{character_id}",
    response_model=CharacterResponse,
    status_code=status.HTTP_200_OK,
    summary="Buscar personagem por ID",
    description="Retorna os dados completos de um personagem específico.",
)
def get_character_endpoint(
    character_id: int,
    db: Session = Depends(get_db),
):
    character = get_character_by_id(db, character_id)
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    return character