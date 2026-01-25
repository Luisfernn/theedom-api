from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class ShipActor(Base):
    __tablename__ = "ship_actors"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

    # Relationships
    actors = relationship("Actor", secondary="ship_actors_actors", back_populates="ship_actors")
    series = relationship("Series", secondary="ship_actors_series", back_populates="ship_actors")
