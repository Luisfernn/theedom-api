from sqlalchemy import Column, Integer, String, Date
from app.models.base import Base
from sqlalchemy.orm import relationship

class Actor(Base):
    __tablename__ = "actors"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    nickname = Column(String, nullable=False)
    nationality = Column(String, nullable=False)
    gender = Column(String, nullable=False)

    birthday = Column(Date, nullable=True)
    agency = Column(String, nullable=True)
    ig = Column(String, nullable=True)

    series = relationship("Series", secondary="series_actors", back_populates="actors")

    characters = relationship(
        "SeriesCharacter",
        back_populates="actor",
        cascade="all, delete-orphan"
    )