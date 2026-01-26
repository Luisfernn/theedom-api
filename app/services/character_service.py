from sqlalchemy.orm import Session
from typing import Optional

from app.models.characters import Character
from app.models.series import Series
from app.models.actors import Actor


def get_character_by_id(db: Session, character_id: int) -> Character | None:
    return db.query(Character).filter(Character.id == character_id).first()


def create_character(
    db: Session,
    *,
    name: str,
    series_id: int,
    actor_id: Optional[int] = None,
    role_type: str,
) -> Character:
    series = db.query(Series).filter(Series.id == series_id).first()
    if not series:
        raise ValueError(f"Series with id {series_id} not found. Please verify the series exists.")

    if actor_id:
        actor = db.query(Actor).filter(Actor.id == actor_id).first()
        if not actor:
            raise ValueError(f"Actor with id {actor_id} not found. Please verify the actor exists.")

    character = Character(
        name=name.strip(),
        series_id=series_id,
        actor_id=actor_id,
        role_type=role_type.strip(),
    )

    db.add(character)
    db.commit()
    db.refresh(character)

    return character