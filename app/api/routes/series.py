from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from fastapi import Query
from typing import List
from app.schemas.series import SeriesCreate, SeriesResponse, SeriesDetailResponse
from app.services.series_service import create_series, list_series, get_series_by_id, get_series_with_details, get_series_filters
from app.services.series_tag_service import add_tags_to_series, add_tags_to_series_by_id
from app.schemas.series_tags import SeriesTagsAdd
from app.schemas.series_actors import SeriesActorsAdd, SeriesActorByNicknameAdd
from app.services.series_actor_service import add_actors_to_series
from app.schemas.series_characters import SeriesCharactersAdd
from app.services.series_character_service import add_characters_to_series
from app.schemas.ship_actors_series import ShipActorsSeriesCreate, ShipActorsByNameCreate
from app.services.ship_actors_series_service import add_ship_actor_to_series
from app.services.actor_service import get_actor_by_nickname, actor_belongs_to_series
from app.services.ship_actor_service import get_ship_actor_by_name, create_ship_actor, add_actors_to_ship
from app.models.ship_actors_series import ShipActorSeries
from app.schemas.ship_characters import ShipCharactersByNameCreate
from app.services.character_service import get_character_by_name_in_series
from app.services.ship_character_service import get_ship_character_by_name, create_ship_character, add_characters_to_ship
from app.models.ship_characters_characters import ShipCharacterCharacter
from app.models.characters import Character


router = APIRouter(prefix="/series", tags=["Series"])


@router.post(
    "",
    response_model=SeriesResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar uma nova série",
    description="Cria uma nova série BL no banco de dados com todas as informações necessárias (título, país, data de lançamento, número de episódios, etc).",
)
def create_series_endpoint(
    series_in: SeriesCreate,
    db: Session = Depends(get_db),
):
    try:
        series = create_series(db, series_in)
        return series

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/{title}/tags",
    status_code=status.HTTP_200_OK,
    summary="Adicionar tags a uma série",
    description="Associa uma ou mais tags a uma série existente. Se a tag não existir, ela será criada automaticamente.",
)
def add_tags_to_series_endpoint(
    title: str,
    payload: SeriesTagsAdd,
    db: Session = Depends(get_db),
):
    try:
        add_tags_to_series(
            db,
            series_title=title,
            tag_names=payload.tags,
        )
        return {"message": "Tags adicionadas com sucesso."}
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.post(
    "/{series_id}/tags",
    status_code=status.HTTP_200_OK,
    summary="Adicionar tags a uma série por ID",
    description="Associa uma ou mais tags a uma série existente usando o ID. Se a tag não existir, ela será criada automaticamente.",
)
def add_tags_to_series_by_id_endpoint(
    series_id: int,
    payload: SeriesTagsAdd,
    db: Session = Depends(get_db),
):
    try:
        add_tags_to_series_by_id(
            db,
            series_id=series_id,
            tag_names=payload.tags,
        )
        return {"message": "Tags adicionadas com sucesso."}
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.post(
    "/{series_id}/actors",
    status_code=status.HTTP_200_OK,
    summary="Adicionar atores a uma série",
    description="Associa um ou mais atores a uma série existente. Valida que todos os atores existem antes de criar as associações.",
)
def add_actors_to_series_endpoint(
    series_id: int,
    payload: SeriesActorsAdd,
    db: Session = Depends(get_db),
):
    try:
        add_actors_to_series(
            db,
            series_id=series_id,
            actor_ids=payload.actor_ids,
        )
        return {"message": "Atores adicionados com sucesso."}

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.post(
    "/{series_id}/actors-by-nickname",
    status_code=status.HTTP_200_OK,
    summary="Vincular ator por nickname",
    description="Vincula um ator existente a uma série usando o nickname do ator.",
)
def add_actor_by_nickname_endpoint(
    series_id: int,
    payload: SeriesActorByNicknameAdd,
    db: Session = Depends(get_db),
):
    # Validar série existe
    series = get_series_by_id(db, series_id)
    if not series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Série com id {series_id} não encontrada",
        )

    # Buscar ator por nickname
    actor = get_actor_by_nickname(db, payload.actor_nickname)
    if not actor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Ator com nickname "{payload.actor_nickname}" não encontrado',
        )

    # Verificar se já está vinculado
    if actor_belongs_to_series(db, actor.id, series_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Ator "{actor.nickname}" já está vinculado a esta série',
        )

    # Vincular ator à série
    add_actors_to_series(db, series_id=series_id, actor_ids=[actor.id])

    return {"message": f'Ator "{actor.nickname}" vinculado com sucesso.'} 


@router.post(
    "/{series_id}/characters",
    status_code=status.HTTP_200_OK,
    summary="Adicionar personagens a uma série",
    description="Associa um ou mais personagens a uma série existente. Valida que todos os personagens existem antes de criar as associações.",
)
def add_characters_to_series_endpoint(
    series_id: int,
    payload: SeriesCharactersAdd,
    db: Session = Depends(get_db),
):
    try:
        add_characters_to_series(
            db,
            series_id=series_id,
            character_ids=payload.character_ids,
        )
        return {"message": "Personagens adicionados com sucesso."}

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )               


@router.get(
    "",
    response_model=List[SeriesResponse],
    status_code=status.HTTP_200_OK,
    summary="Listar séries",
    description="Retorna uma lista de todas as séries cadastradas. Opcionalmente, pode filtrar por título usando o parâmetro 'search'.",
)
def list_series_endpoint(
    search: str | None = Query(default=None, description="Termo de busca para filtrar séries por título"),
    country: str | None = Query(default=None, description="Filtrar por país"),
    status_filter: str | None = Query(default=None, alias="status", description="Filtrar por status (Completed/Dropped)"),
    year: int | None = Query(default=None, description="Filtrar por ano de lançamento"),
    db: Session = Depends(get_db),
):
    return list_series(db, search=search, country=country, status=status_filter, year=year)


@router.get(
    "/filters",
    status_code=status.HTTP_200_OK,
    summary="Opções de filtro para listagem",
    description="Retorna países, status e anos disponíveis para filtrar séries.",
)
def get_filters_endpoint(db: Session = Depends(get_db)):
    return get_series_filters(db)


@router.get(
    "/{series_id}",
    response_model=SeriesDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Buscar série por ID",
    description="Retorna os dados completos de uma série, incluindo atores, personagens, tags, ship_actors e ship_characters associados.",
)
def get_series_endpoint(
    series_id: int,
    db: Session = Depends(get_db),
):
    series = get_series_with_details(db, series_id)
    if not series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Series not found"
        )
    return series


@router.post(
    "/{series_id}/ship-actors",
    status_code=status.HTTP_200_OK,
    summary="Adicionar ship de atores a uma série",
    description="Associa um ship de atores a uma série existente. Valida que tanto a série quanto o ship existem antes de criar a associação.",
)
def add_ship_actors_to_series_endpoint(
    series_id: int,
    payload: ShipActorsSeriesCreate,
    db: Session = Depends(get_db),
):
    try:
        add_ship_actor_to_series(
            db,
            series_id=series_id,
            ship_actor_id=payload.ship_id,
        )
        return {"message": "Ship de atores associado à série com sucesso."}

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.post(
    "/{series_id}/ship-actors-by-name",
    status_code=status.HTTP_201_CREATED,
    summary="Criar ship de atores por nome",
    description="Cria um ship de atores usando os nicknames dos atores. Valida que ambos pertencem à série.",
)
def create_ship_actors_by_name_endpoint(
    series_id: int,
    payload: ShipActorsByNameCreate,
    db: Session = Depends(get_db),
):
    from app.services.series_service import get_series_by_id

    # Validar série existe
    series = get_series_by_id(db, series_id)
    if not series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Série com id {series_id} não encontrada",
        )

    # Buscar atores por nickname
    actor1 = get_actor_by_nickname(db, payload.actor1_nickname)
    if not actor1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Ator com nickname "{payload.actor1_nickname}" não encontrado',
        )

    actor2 = get_actor_by_nickname(db, payload.actor2_nickname)
    if not actor2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Ator com nickname "{payload.actor2_nickname}" não encontrado',
        )

    # Validar atores diferentes
    if actor1.id == actor2.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Os dois atores devem ser diferentes",
        )

    # Validar atores pertencem à série
    if not actor_belongs_to_series(db, actor1.id, series_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Ator "{actor1.nickname}" não está vinculado a esta série',
        )

    if not actor_belongs_to_series(db, actor2.id, series_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Ator "{actor2.nickname}" não está vinculado a esta série',
        )

    # Verificar se já existe ship com esse nome nesta série
    existing_ship = get_ship_actor_by_name(db, payload.ship_name)
    if existing_ship:
        already_in_series = (
            db.query(ShipActorSeries)
            .filter(
                ShipActorSeries.ship_id == existing_ship.id,
                ShipActorSeries.series_id == series_id,
            )
            .first()
        )
        if already_in_series:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Já existe um ship "{payload.ship_name}" nesta série',
            )

    # Criar ship (ou obter existente de outra série)
    ship = create_ship_actor(db, name=payload.ship_name)

    # Vincular atores ao ship
    add_actors_to_ship(db, ship.id, [actor1.id, actor2.id])

    # Vincular ship à série
    add_ship_actor_to_series(db, series_id=series_id, ship_actor_id=ship.id)

    return {"message": "Ship de atores criado com sucesso.", "ship_id": ship.id}


@router.post(
    "/{series_id}/ship-characters-by-name",
    status_code=status.HTTP_201_CREATED,
    summary="Criar ship de personagens por nome",
    description="Cria um ship de personagens usando os nomes dos personagens. Os personagens devem pertencer à série.",
)
def create_ship_characters_by_name_endpoint(
    series_id: int,
    payload: ShipCharactersByNameCreate,
    db: Session = Depends(get_db),
):
    from app.services.series_service import get_series_by_id

    # Validar série existe
    series = get_series_by_id(db, series_id)
    if not series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Série com id {series_id} não encontrada",
        )

    # Buscar personagens por nome dentro da série
    character1 = get_character_by_name_in_series(db, payload.character1_name, series_id)
    if not character1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Personagem "{payload.character1_name}" não encontrado nesta série',
        )

    character2 = get_character_by_name_in_series(db, payload.character2_name, series_id)
    if not character2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Personagem "{payload.character2_name}" não encontrado nesta série',
        )

    # Validar personagens diferentes
    if character1.id == character2.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Os dois personagens devem ser diferentes",
        )

    # Verificar se já existe ship com esse nome vinculado a personagens desta série
    existing_ship = get_ship_character_by_name(db, payload.ship_name)
    if existing_ship:
        ship_in_series = (
            db.query(ShipCharacterCharacter)
            .join(Character, ShipCharacterCharacter.character_id == Character.id)
            .filter(
                ShipCharacterCharacter.ship_id == existing_ship.id,
                Character.series_id == series_id,
            )
            .first()
        )
        if ship_in_series:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Já existe um ship "{payload.ship_name}" nesta série',
            )

    # Criar ship (ou obter existente de outra série)
    ship = create_ship_character(db, name=payload.ship_name)

    # Vincular personagens ao ship
    add_characters_to_ship(db, ship.id, [character1.id, character2.id])

    return {"message": "Ship de personagens criado com sucesso.", "ship_id": ship.id}