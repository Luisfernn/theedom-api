from pydantic import BaseModel, Field
from typing import List


class ShipActorBase(BaseModel):
    name: str = Field(..., example="JiKook")


class ShipActorCreate(ShipActorBase):
    pass


class ShipActorResponse(ShipActorBase):
    id: int

    class Config:
        from_attributes = True


class ShipActorActorsAdd(BaseModel):
    actor_ids: List[int] = Field(..., example=[1, 2])
