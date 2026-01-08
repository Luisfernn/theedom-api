from sqlalchemy.orm import Session
from app.models.series import Series
from app.models.series_actors import SeriesActor

def add_actors_to_series(db: Session, series_id: int, actor_names: list[str]) -> None:
    series = db.query(Series).filter(Series.id == series_id).first()

    if not series:
        raise ValueError("Series not found.")

    for name in actor_names:
        actor = get_actor_by_name(db, name)
        if not actor:
            continue  # Ou criar o ator, dependendo do seu fluxo

        # Verifica se a associação já existe
        exists = (
            db.query(SeriesActor)
            .filter(SeriesActor.series_id == series.id, SeriesActor.actor_id == actor.id)
            .first()
        )

        if not exists:
            association = SeriesActor(series_id=series.id, actor_id=actor.id)
            db.add(association)

    db.commit()


def list_series(db: Session) -> list[Series]:
    return db.query(Series).order_by(Series.title).all()