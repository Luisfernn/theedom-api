from sqlalchemy import Column, Integer, String
from app.models.base import Base

class Actor(Base):
    __tablename__ = "actors"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

    birthday = Column(String, nullable=True)
    agency = Column(String, nullable=True)
    ig = Column(String, nullable=True)