from sqlalchemy.orm import Session, joinedload
from app.models.series import Series
from app.schemas.series import SeriesCreate
from app.models.series_actors import SeriesActor
from sqlalchemy import func, extract
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


def get_series_by_id(db: Session, series_id: int):
    return db.query(Series).filter(Series.id == series_id).first()


def get_ship_characters_for_series(db: Session, series_id: int) -> list:
    """Busca ship_characters de uma série através dos personagens"""
    from app.models.ship_characters import ShipCharacter
    from app.models.ship_characters_characters import ShipCharacterCharacter
    from app.models.characters import Character

    return (
        db.query(ShipCharacter)
        .join(ShipCharacterCharacter, ShipCharacter.id == ShipCharacterCharacter.ship_id)
        .join(Character, ShipCharacterCharacter.character_id == Character.id)
        .filter(Character.series_id == series_id)
        .distinct()
        .all()
    )


def get_series_with_details(db: Session, series_id: int):
    """Busca série com todos os dados relacionados (actors, characters, tags, ship_actors, ship_characters)"""
    series = (
        db.query(Series)
        .filter(Series.id == series_id)
        .options(
            joinedload(Series.actors),
            joinedload(Series.characters),
            joinedload(Series.tags),
            joinedload(Series.ship_actors)
        )
        .first()
    )

    if series:
        # Adicionar ship_characters manualmente através da query customizada
        series.ship_characters = get_ship_characters_for_series(db, series_id)

    return series


def add_actors_to_series(db: Session, series_id: int, actor_names: list[str]) -> None:
    series = db.query(Series).filter(Series.id == series_id).first()

    if not series:
        raise ValueError(f"Series with id {series_id} not found. Please verify the series exists.")

    for name in actor_names:
        actor = get_actor_by_name(db, name)
        if not actor:
            raise ValueError(f"Actor with name '{name}' not found. Please verify the actor exists.")

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
    country: str | None = None,
    status: str | None = None,
    year: int | None = None,
) -> list[Series]:
    query = db.query(Series)

    if search:
        query = query.filter(
            func.lower(Series.title).like(f"%{search.lower()}%")
        )
    if country:
        query = query.filter(Series.country == country)
    if status:
        query = query.filter(Series.status == status)
    if year:
        query = query.filter(extract('year', Series.release_date) == year)

    return query.order_by(Series.release_date.desc()).all()


def get_series_filters(db: Session) -> dict:
    countries = (
        db.query(Series.country)
        .distinct()
        .order_by(Series.country)
        .all()
    )
    years = (
        db.query(extract('year', Series.release_date))
        .distinct()
        .order_by(extract('year', Series.release_date).desc())
        .all()
    )
    return {
        "countries": [c[0] for c in countries if c[0]],
        "statuses": ["Completed", "Dropped"],
        "years": [int(y[0]) for y in years if y[0]],
    }