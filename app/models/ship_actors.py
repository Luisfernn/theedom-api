from sqlalchemy import Column, Integer, String
from app.models.base import Base

class ShipActor(Base):
    __tablename__ = "ship_actors"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)