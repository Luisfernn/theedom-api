from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, Literal, List
from datetime import date
from decimal import Decimal


class SeriesBase(BaseModel):
    title: str = Field(..., example="Love in the Moonlight")
    country: str = Field(..., example="Thailand")
    release_date: date = Field(..., example="2023-08-15")
    episode_number: int = Field(..., example="12", ge=1)
    genre: str = Field(..., example="Romance, Drama")
    synopsis: str = Field(..., example="A story about...")
    platform: str = Field(..., example="Netflix")
    rate: Decimal = Field(..., example=8.5, ge=0, le=10)

    # Campos opcionais
    status: Optional[Literal["Completed", "Dropped"]] = Field(
        None,
        example="Completed",
        description="Status da série: 'Completed' ou 'Dropped'"
    )
    production_company: Optional[str] = Field(None, example="GMMTV")
    date_start: Optional[date] = Field(None, example="2023-08-15")
    date_watched: Optional[date] = Field(None, example="2023-09-20")

    @model_validator(mode='after')
    def validate_dates(self):
        if self.date_start and self.date_start < self.release_date:
            raise ValueError('date_start cannot be before release_date')

        if self.date_watched and self.date_watched < self.release_date:
            raise ValueError('date_watched cannot be before release_date')

        return self


class SeriesCreate(SeriesBase):
    pass


class SeriesResponse(SeriesBase):
    id: int

    class Config:
        from_attributes = True


class ActorInSeries(BaseModel):
    id: int
    name: str
    nickname: str
    birthday: Optional[date] = None
    agency: Optional[str] = None
    ig: Optional[str] = None

    class Config:
        from_attributes = True


class CharacterInSeries(BaseModel):
    id: int
    name: str
    role_type: str
    actor_id: Optional[int] = None

    class Config:
        from_attributes = True


class TagInSeries(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ShipActorInSeries(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ShipCharacterInSeries(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class SeriesDetailResponse(SeriesBase):
    id: int
    actors: List[ActorInSeries] = []
    characters: List[CharacterInSeries] = []
    tags: List[TagInSeries] = []
    ship_actors: List[ShipActorInSeries] = []
    ship_characters: List[ShipCharacterInSeries] = []

    class Config:
        from_attributes = True