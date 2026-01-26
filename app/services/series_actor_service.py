from sqlalchemy.orm import Session

from app.models.series import Series
from app.models.actors import Actor
from app.models.series_actors import SeriesActor


def add_actors_to_series(
    db: Session,
    *,
    series_id: int,
    actor_ids: list[int],
) -> None:
    series = db.query(Series).filter(Series.id == series_id).first()

    if not series:
        raise ValueError(f"Series with id {series_id} not found. Please verify the series exists.")

    for actor_id in actor_ids:
        actor = db.query(Actor).filter(Actor.id == actor_id).first()
        if not actor:
            raise ValueError(f"Actor with id {actor_id} not found. Please verify the actor exists.")

        exists = (
            db.query(SeriesActor)
            .filter(
                SeriesActor.series_id == series.id,
                SeriesActor.actor_id == actor.id,
            )
            .first()
        )

        if exists:
            continue

        db.add(
            SeriesActor(
                series_id=series.id,
                actor_id=actor.id,
            )
        )

    db.commit()