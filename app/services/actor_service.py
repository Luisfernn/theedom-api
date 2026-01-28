from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional

from app.models.actors import Actor


def get_actor_by_name(db: Session, name: str) -> Actor | None:
    normalized_name = name.strip()

    return (
        db.query(Actor)
        .filter(func.lower(Actor.name) == func.lower(normalized_name))
        .first()
    )


def get_actor_by_nickname(db: Session, nickname: str) -> Actor | None:
    """
    Busca ator por nickname (case-insensitive).
    Normaliza apenas para comparação, não altera o valor salvo.
    """
    normalized = nickname.strip()
    return (
        db.query(Actor)
        .filter(func.lower(Actor.nickname) == func.lower(normalized))
        .first()
    )


def get_actor_by_id(db: Session, actor_id: int) -> Actor | None:
    return db.query(Actor).filter(Actor.id == actor_id).first()


def create_actor(
    db: Session,
    *,
    name: str,
    nickname: str,
    nationality: str,
    gender: str,
    birthday: Optional[date] = None,
    agency: Optional[str] = None,
    ig: Optional[str] = None
) -> Actor:
    """
    Creates an actor if it does not exist.
    Returns the existing actor otherwise.
    """

    existing_actor = get_actor_by_name(db, name)
    if existing_actor:
        return existing_actor

    actor = Actor(
        name=name.strip(),
        nickname=nickname.strip(),
        nationality=nationality.strip(),
        gender=gender.strip(),
        birthday=birthday,
        agency=agency.strip() if agency else None,
        ig=ig.strip() if ig else None
    )
    db.add(actor)
    db.commit()
    db.refresh(actor)

    return actor