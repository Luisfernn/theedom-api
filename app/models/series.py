from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class Series(Base):
    __tablename__ = "series"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    country = Column(String, nullable=False)
    status = Column(String, nullable=True)
    production_company = Column(String, nullable=True)
    date_start = Column(String, nullable=True)      
    date_watched = Column(String, nullable=True)

    tags = relationship("Tag", secondary="series_tag", back_populates="series")
    actors = relationship("Actor", secondary="series_actors", back_populates="series")

    characters = relationship(
        "SeriesCharacter",
        back_populates="series",
        cascade="all, delete-orphan"
    )