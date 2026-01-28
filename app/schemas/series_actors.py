from pydantic import BaseModel
from typing import List


class SeriesActorsAdd(BaseModel):
    actor_ids: List[int]


class SeriesActorByNicknameAdd(BaseModel):
    actor_nickname: str