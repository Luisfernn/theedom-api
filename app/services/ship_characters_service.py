from sqlalchemy.orm import Session

from app.models.series import Series
from app.models.ship_characters import ShipCharacter
from app.models.ship_characters_series import ShipCharacterSeries


def add_ship_character_to_series(
    db: Session,
    *,
    series_id: int,
    ship_character_id: int,
) -> None:
    series = db.query(Series).filter(Series.id == series_id).first()
    if not series:
        raise ValueError("Series not found.")

    ship = (
        db.query(ShipCharacter)
        .filter(ShipCharacter.id == ship_character_id)
        .first()
    )
    if not ship:
        raise ValueError("Ship character not found.")

    exists = (
        db.query(ShipCharacterSeries)
        .filter(
            ShipCharacterSeries.series_id == series_id,
            ShipCharacterSeries.ship_id == ship_character_id,
        )
        .first()
    )
    if exists:
        return

    db.add(
        ShipCharacterSeries(
            series_id=series_id,
            ship_id=ship_character_id,
        )
    )
    db.commit()