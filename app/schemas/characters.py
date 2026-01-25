from pydantic import BaseModel


class CharacterCreate(BaseModel):
    name: str
    series_id: int


class CharacterResponse(BaseModel):
    id: int
    name: str
    series_id: int

    class Config:
        from_attributes = True