from sqlalchemy import Column, Integer, String
from app.models.base import Base

class ShipCharacter(Base):
    __tablename__ = "ship_characters"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)