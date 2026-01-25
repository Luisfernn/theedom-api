from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from app.models.base import Base

class Actor(Base):
    __tablename__ = "actors"

    id = Column(Integer, primary_key=True)
    nickname = Column(String, nullable=False, unique=True)
    birthday = Column(Date)
    nationality = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    agency = Column(String)
    name = Column(String, nullable=False)
    ig = Column(String)

    # Relationships
    series = relationship("Series", secondary="series_actors", back_populates="actors")
    characters = relationship("Character", back_populates="actor")
    ship_actors = relationship("ShipActor", secondary="ship_actors_actors", back_populates="actors")
