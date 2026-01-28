from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.tag import TagCreate, TagResponse
from app.services.tag_service import create_tag, get_tag_by_name, get_tag_by_id, list_tags
from typing import List

router = APIRouter(
    prefix="/tags",
    tags=["Tags"]
)


@router.get(
    "/",
    response_model=List[TagResponse],
    summary="Listar todas as tags",
    description="Retorna todas as tags cadastradas, ordenadas por nome.",
)
def list_all_tags(db: Session = Depends(get_db)):
    return list_tags(db=db)


@router.post(
    "/",
    response_model=TagResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar uma nova tag",
    description="Cria uma nova tag no banco de dados.",
)
def create_new_tag(tag: TagCreate, db: Session = Depends(get_db)):
    return create_tag(db=db, name=tag.name)


@router.get(
    "/by-name/{name}",
    response_model=TagResponse,
    summary="Buscar tag por nome",
    description="Retorna os dados de uma tag específica pelo nome.",
)
def get_tag_by_name_endpoint(name: str, db: Session = Depends(get_db)):
    tag = get_tag_by_name(db=db, name=name)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    return tag


@router.get(
    "/{tag_id}",
    response_model=TagResponse,
    summary="Buscar tag por ID",
    description="Retorna os dados de uma tag específica pelo ID.",
)
def get_tag_endpoint(tag_id: int, db: Session = Depends(get_db)):
    tag = get_tag_by_id(db=db, tag_id=tag_id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    return tag