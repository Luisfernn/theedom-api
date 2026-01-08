@router.post(
    "",
    response_model=CharacterResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_character_endpoint(
    payload: CharacterCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_character(db, **payload.dict())
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )