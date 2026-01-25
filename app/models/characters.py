from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    series_id = Column(Integer, ForeignKey("series.id"))
    actor_id = Column(Integer, ForeignKey("actors.id"))
    role_type = Column(String, nullable=False)

    # Relationships
    series = relationship("Series", back_populates="characters")
    actor = relationship("Actor", back_populates="characters")
    ship_characters = relationship("ShipCharacter", secondary="ship_characters_characters", back_populates="characters")
