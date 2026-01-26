from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.actors import ActorCreate, ActorResponse
from app.services.actor_service import create_actor, get_actor_by_id

router = APIRouter(prefix="/actors", tags=["Actors"])


@router.post(
    "",
    response_model=ActorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar um novo ator",
    description="Cria um novo ator no banco de dados com informações como nome, apelido, nacionalidade, gênero, aniversário, agência e Instagram.",
)
def create_actor_endpoint(
    actor_in: ActorCreate,
    db: Session = Depends(get_db),
):
    return create_actor(
        db,
        name=actor_in.name,
        nickname=actor_in.nickname,
        nationality=actor_in.nationality,
        gender=actor_in.gender,
        birthday=actor_in.birthday,
        agency=actor_in.agency,
        ig=actor_in.ig
    )


@router.get(
    "/{actor_id}",
    response_model=ActorResponse,
    status_code=status.HTTP_200_OK,
    summary="Buscar ator por ID",
    description="Retorna os dados completos de um ator específico.",
)
def get_actor_endpoint(
    actor_id: int,
    db: Session = Depends(get_db),
):
    actor = get_actor_by_id(db, actor_id)
    if not actor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actor not found"
        )
    return actor