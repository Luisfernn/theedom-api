from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.series import Series


def get_series_by_title(db: Session, title: str) -> Series | None:
    normalized_title = title.strip()

    return (
        db.query(Series)
        .filter(func.lower(Series.title) == func.lower(normalized_title))
        .first()
    )