from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.ship_characters import ShipCharacter
from app.models.characters import Character
from app.models.ship_characters_characters import ShipCharacterCharacter


def get_ship_character_by_name(db: Session, name: str) -> ShipCharacter | None:
    normalized_name = name.strip()
    return (
        db.query(ShipCharacter)
        .filter(func.lower(ShipCharacter.name) == func.lower(normalized_name))
        .first()
    )


def get_ship_character_by_id(db: Session, ship_id: int) -> ShipCharacter | None:
    return db.query(ShipCharacter).filter(ShipCharacter.id == ship_id).first()


def create_ship_character(db: Session, *, name: str) -> ShipCharacter:
    """
    Creates a ship character if it does not exist.
    Returns the existing ship otherwise.
    """
    existing_ship = get_ship_character_by_name(db, name)
    if existing_ship:
        return existing_ship

    ship = ShipCharacter(name=name.strip())
    db.add(ship)
    db.commit()
    db.refresh(ship)

    return ship


def add_characters_to_ship(db: Session, ship_id: int, character_ids: list[int]) -> None:
    """Adiciona personagens a um ship"""
    ship = get_ship_character_by_id(db, ship_id)
    if not ship:
        raise ValueError(f"Ship character with id {ship_id} not found. Please verify the ship exists.")

    for character_id in character_ids:
        character = db.query(Character).filter(Character.id == character_id).first()
        if not character:
            raise ValueError(f"Character with id {character_id} not found. Please verify the character exists.")

        # Verifica se a associação já existe
        exists = (
            db.query(ShipCharacterCharacter)
            .filter(
                ShipCharacterCharacter.ship_id == ship_id,
                ShipCharacterCharacter.character_id == character_id
            )
            .first()
        )

        if not exists:
            association = ShipCharacterCharacter(ship_id=ship_id, character_id=character_id)
            db.add(association)

    db.commit()
