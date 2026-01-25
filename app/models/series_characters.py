from sqlalchemy import Column, Integer, ForeignKey, String
from app.models.base import Base


class SeriesCharacter(Base):
    __tablename__ = "series_characters"

    id = Column(Integer, primary_key=True)

    series_id = Column(Integer, ForeignKey("series.id"), nullable=False)
    actor_id = Column(Integer, ForeignKey("actors.id"), nullable=False)

    character_name = Column(String, nullable=False)