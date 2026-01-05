from sqlalchemy import Column, Integer, ForeignKey
from app.models.base import Base

class SeriesActor(Base):
    __tablename__ = "series_actors"

    series_id = Column(Integer, ForeignKey("series.id"), primary_key=True)
    actor_id = Column(Integer, ForeignKey("actors.id"), primary_key=True)