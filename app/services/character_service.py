def create_character(
    db: Session,
    *,
    name: str,
    series_id: int,
) -> Character:
    series = db.query(Series).filter(Series.id == series_id).first()
    if not series:
        raise ValueError("Series not found.")

    character = Character(
        name=name.strip(),
        series_id=series_id,
    )

    db.add(character)
    db.commit()
    db.refresh(character)

    return character