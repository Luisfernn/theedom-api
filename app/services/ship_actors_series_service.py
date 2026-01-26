from sqlalchemy.orm import Session

from app.models.series import Series
from app.models.ship_actors import ShipActor
from app.models.ship_actors_series import ShipActorSeries

def add_ship_actor_to_series(
    db: Session,
    *,
    series_id: int,
    ship_actor_id: int,
) -> None:
    series = db.query(Series).filter(Series.id == series_id).first()
    if not series:
        raise ValueError(f"Series with id {series_id} not found. Please verify the series exists.")

    ship = db.query(ShipActor).filter(ShipActor.id == ship_actor_id).first()
    if not ship:
        raise ValueError(f"Ship actor with id {ship_actor_id} not found. Please verify the ship exists.")

    exists = (
        db.query(ShipActorSeries)
        .filter(
            ShipActorSeries.series_id == series_id,
            ShipActorSeries.ship_id == ship_actor_id,
        )
        .first()
    )
    if exists:
        return

    db.add(
        ShipActorSeries(
            series_id=series_id,
            ship_id=ship_actor_id,
        )
    )
    db.commit()