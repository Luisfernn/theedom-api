from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.ship_actors import ShipActor
from app.models.actors import Actor
from app.models.ship_actors_actors import ShipActorActor


def get_ship_actor_by_name(db: Session, name: str) -> ShipActor | None:
    normalized_name = name.strip()
    return (
        db.query(ShipActor)
        .filter(func.lower(ShipActor.name) == func.lower(normalized_name))
        .first()
    )


def get_ship_actor_by_id(db: Session, ship_id: int) -> ShipActor | None:
    return db.query(ShipActor).filter(ShipActor.id == ship_id).first()


def create_ship_actor(db: Session, *, name: str) -> ShipActor:
    """
    Creates a ship actor if it does not exist.
    Returns the existing ship otherwise.
    """
    existing_ship = get_ship_actor_by_name(db, name)
    if existing_ship:
        return existing_ship

    ship = ShipActor(name=name.strip())
    db.add(ship)
    db.commit()
    db.refresh(ship)

    return ship


def add_actors_to_ship(db: Session, ship_id: int, actor_ids: list[int]) -> None:
    """Adiciona atores a um ship"""
    ship = get_ship_actor_by_id(db, ship_id)
    if not ship:
        raise ValueError(f"Ship actor with id {ship_id} not found. Please verify the ship exists.")

    for actor_id in actor_ids:
        actor = db.query(Actor).filter(Actor.id == actor_id).first()
        if not actor:
            raise ValueError(f"Actor with id {actor_id} not found. Please verify the actor exists.")

        # Verifica se a associação já existe
        exists = (
            db.query(ShipActorActor)
            .filter(
                ShipActorActor.ship_id == ship_id,
                ShipActorActor.actor_id == actor_id
            )
            .first()
        )

        if not exists:
            association = ShipActorActor(ship_id=ship_id, actor_id=actor_id)
            db.add(association)

    db.commit()
