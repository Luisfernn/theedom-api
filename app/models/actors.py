from sqlalchemy import Column, Integer, String
from app.models.base import Base
from sqlalchemy.orm import relationship

class Actor(Base):
    __tablename__ = "actors"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

    birthday = Column(String, nullable=True)
    agency = Column(String, nullable=True)
    ig = Column(String, nullable=True)

    series = relationship("Series", secondary="series_actors", back_populates="actors")