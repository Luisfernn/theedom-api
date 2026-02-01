from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional

from app.models.actors import Actor
from app.models.series_actors import SeriesActor


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


def actor_belongs_to_series(db: Session, actor_id: int, series_id: int) -> bool:
    """
    Verifica se um ator pertence a uma série específica.
    Retorna True se existe vínculo na tabela series_actors.
    """
    return db.query(SeriesActor).filter(
        SeriesActor.actor_id == actor_id,
        SeriesActor.series_id == series_id
    ).first() is not None


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

    existing_by_nickname = get_actor_by_nickname(db, nickname)
    if existing_by_nickname:
        return existing_by_nickname

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