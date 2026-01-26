from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.ship_characters import (
    ShipCharacterCreate,
    ShipCharacterResponse,
    ShipCharacterCharactersAdd
)
from app.services.ship_character_service import (
    create_ship_character,
    get_ship_character_by_id,
    add_characters_to_ship
)

router = APIRouter(prefix="/ship-characters", tags=["Ship Characters"])


@router.post(
    "",
    response_model=ShipCharacterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar um novo ship de personagens",
    description="Cria um novo ship de personagens no banco de dados. Se um ship com o mesmo nome já existir, retorna o existente.",
)
def create_ship_character_endpoint(
    payload: ShipCharacterCreate,
    db: Session = Depends(get_db),
):
    return create_ship_character(db=db, name=payload.name)


@router.get(
    "/{ship_id}",
    response_model=ShipCharacterResponse,
    status_code=status.HTTP_200_OK,
    summary="Buscar ship de personagens por ID",
    description="Retorna os dados de um ship de personagens específico.",
)
def get_ship_character_endpoint(
    ship_id: int,
    db: Session = Depends(get_db),
):
    ship = get_ship_character_by_id(db, ship_id)
    if not ship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ship not found"
        )
    return ship


@router.post(
    "/{ship_id}/characters",
    status_code=status.HTTP_200_OK,
    summary="Adicionar personagens a um ship",
    description="Associa um ou mais personagens a um ship de personagens existente. Valida que todos os personagens existem antes de criar as associações.",
)
def add_characters_to_ship_endpoint(
    ship_id: int,
    payload: ShipCharacterCharactersAdd,
    db: Session = Depends(get_db),
):
    try:
        add_characters_to_ship(
            db,
            ship_id=ship_id,
            character_ids=payload.character_ids,
        )
        return {"message": "Personagens adicionados ao ship com sucesso."}

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
