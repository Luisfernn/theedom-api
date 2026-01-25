from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.actors import Actor


def get_actor_by_name(db: Session, name: str) -> Actor | None:
    normalized_name = name.strip()

    return (
        db.query(Actor)
        .filter(func.lower(Actor.name) == func.lower(normalized_name))
        .first()
    )


def create_actor(
    db: Session,
    *,
    name: str,
    nickname: str,
    nationality: str,
    gender: str
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
        gender=gender.strip()
    )
    db.add(actor)
    db.commit()
    db.refresh(actor)

    return actor