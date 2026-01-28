from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.tags import Tag


def get_tag_by_name(db: Session, name: str) -> Tag | None:
    normalized_name = name.strip()

    return (
        db.query(Tag)
        .filter(func.lower(Tag.name) == func.lower(normalized_name))
        .first()
    )


def get_tag_by_id(db: Session, tag_id: int) -> Tag | None:
    return db.query(Tag).filter(Tag.id == tag_id).first()


def list_tags(db: Session) -> list[Tag]:
    return db.query(Tag).order_by(Tag.name).all()


def create_tag(db: Session, *, name: str) -> Tag:
    """
    Creates a tag if it does not exist.
    Returns the existing tag otherwise.
    """

    existing_tag = get_tag_by_name(db, name)
    if existing_tag:
        return existing_tag

    tag = Tag(name=name.strip())
    db.add(tag)
    db.commit()
    db.refresh(tag)

    return tag