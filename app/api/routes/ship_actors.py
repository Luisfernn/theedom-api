from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.ship_actors import (
    ShipActorCreate,
    ShipActorResponse,
    ShipActorActorsAdd
)
from app.services.ship_actor_service import (
    create_ship_actor,
    get_ship_actor_by_id,
    add_actors_to_ship
)

router = APIRouter(prefix="/ship-actors", tags=["Ship Actors"])


@router.post(
    "",
    response_model=ShipActorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar um novo ship de atores",
    description="Cria um novo ship de atores no banco de dados. Se um ship com o mesmo nome já existir, retorna o existente.",
)
def create_ship_actor_endpoint(
    payload: ShipActorCreate,
    db: Session = Depends(get_db),
):
    return create_ship_actor(db=db, name=payload.name)


@router.get(
    "/{ship_id}",
    response_model=ShipActorResponse,
    status_code=status.HTTP_200_OK,
    summary="Buscar ship de atores por ID",
    description="Retorna os dados de um ship de atores específico.",
)
def get_ship_actor_endpoint(
    ship_id: int,
    db: Session = Depends(get_db),
):
    ship = get_ship_actor_by_id(db, ship_id)
    if not ship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ship not found"
        )
    return ship


@router.post(
    "/{ship_id}/actors",
    status_code=status.HTTP_200_OK,
    summary="Adicionar atores a um ship",
    description="Associa um ou mais atores a um ship de atores existente. Valida que todos os atores existem antes de criar as associações.",
)
def add_actors_to_ship_endpoint(
    ship_id: int,
    payload: ShipActorActorsAdd,
    db: Session = Depends(get_db),
):
    try:
        add_actors_to_ship(
            db,
            ship_id=ship_id,
            actor_ids=payload.actor_ids,
        )
        return {"message": "Atores adicionados ao ship com sucesso."}

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
