from pydantic import BaseModel


class ActorBase(BaseModel):
    name: str
    nickname: str
    nationality: str
    gender: str


class ActorCreate(ActorBase):
    pass


class ActorResponse(ActorBase):
    id: int

    class Config:
        from_attributes = True