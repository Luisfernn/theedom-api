from sqlalchemy.orm import Session
from app.models.series import Series
from app.schemas.series import SeriesCreate
from app.models.series_actors import SeriesActor
from sqlalchemy import func
from app.services.actor_service import get_actor_by_name

def create_series(db: Session, series: SeriesCreate):
    db_series = Series(
        title=series.title,
        country=series.country,
        release_date=series.release_date,
        episode_number=series.episode_number,
        genre=series.genre,
        synopsis=series.synopsis,
        platform=series.platform,
        rate=series.rate,
        status=series.status,
        production_company=series.production_company,
        date_start=series.date_start,
        date_watched=series.date_watched,
    )

    db.add(db_series)
    db.commit()
    db.refresh(db_series)

    return db_series

def get_series_by_title(db: Session, title: str):
    return db.query(Series).filter(Series.title == title).first()    



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


def list_series(
    db: Session,
    search: str | None = None,
) -> list[Series]:
    query = db.query(Series)

    if search:
        query = query.filter(
            func.lower(Series.title).like(f"%{search.lower()}%")
        )

    return query.order_by(Series.title).all()