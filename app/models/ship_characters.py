from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class ShipCharacter(Base):
    __tablename__ = "ship_characters"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

    # Relationships
    characters = relationship("Character", secondary="ship_characters_characters", back_populates="ship_characters")
