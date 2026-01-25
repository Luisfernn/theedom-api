from sqlalchemy import Column, Integer, String, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.models.base import Base

class Series(Base):
    __tablename__ = "series"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False, unique=True)
    country = Column(String, nullable=False)
    release_date = Column(Date, nullable=False)
    episode_number = Column(Integer, nullable=False)
    genre = Column(String, nullable=False)
    synopsis = Column(Text, nullable=False)
    platform = Column(String, nullable=False)
    rate = Column(Numeric, nullable=False)
    status = Column(String)
    production_company = Column(String)
    date_start = Column(Date)
    date_watched = Column(Date)

    # Relationships
    actors = relationship("Actor", secondary="series_actors", back_populates="series")
    tags = relationship("Tag", secondary="series_tag", back_populates="series")
    characters = relationship("Character", back_populates="series")
    ship_actors = relationship("ShipActor", secondary="ship_actors_series", back_populates="series")
