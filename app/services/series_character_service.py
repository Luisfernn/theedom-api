from sqlalchemy.orm import Session

from app.models.series import Series
from app.models.characters import Character
from app.models.series_characters import SeriesCharacter


def add_characters_to_series(
    db: Session,
    *,
    series_id: int,
    character_ids: list[int],
) -> None:
    series = db.query(Series).filter(Series.id == series_id).first()

    if not series:
        raise ValueError(f"Series with id {series_id} not found. Please verify the series exists.")

    for character_id in character_ids:
        character = db.query(Character).filter(Character.id == character_id).first()
        if not character:
            raise ValueError(f"Character with id {character_id} not found. Please verify the character exists.")

        exists = (
            db.query(SeriesCharacter)
            .filter(
                SeriesCharacter.series_id == series.id,
                SeriesCharacter.character_id == character.id,
            )
            .first()
        )

        if exists:
            continue

        db.add(
            SeriesCharacter(
                series_id=series.id,
                character_id=character.id,
            )
        )

    db.commit()