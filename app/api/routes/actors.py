from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.actors import ActorCreate, ActorResponse
from app.services.actor_service import create_actor

router = APIRouter(prefix="/actors", tags=["Actors"])


@router.post(
    "",
    response_model=ActorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_actor_endpoint(
    actor_in: ActorCreate,
    db: Session = Depends(get_db),
):
    return create_actor(db, name=actor_in.name)