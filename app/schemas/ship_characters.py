from pydantic import BaseModel, Field
from typing import List


class ShipCharacterBase(BaseModel):
    name: str = Field(..., example="VegasPete")


class ShipCharacterCreate(ShipCharacterBase):
    pass


class ShipCharacterResponse(ShipCharacterBase):
    id: int

    class Config:
        from_attributes = True


class ShipCharacterCharactersAdd(BaseModel):
    character_ids: List[int] = Field(..., example=[1, 2])


class ShipCharacterAdd(BaseModel):
    ship_character_id: int