from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.tag import TagCreate, TagResponse
from app.services.tag_service import create_tag, get_tag_by_name

router = APIRouter(
    prefix="/tags",
    tags=["Tags"]
)


@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_new_tag(tag: TagCreate, db: Session = Depends(get_db)):
    return create_tag(db=db, name=tag.name)


@router.get("/{name}", response_model=TagResponse)
def get_tag(name: str, db: Session = Depends(get_db)):
    tag = get_tag_by_name(db=db, name=name)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    return tag