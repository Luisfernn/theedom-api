from sqlalchemy import Column, Integer, String
from app.models.base import Base
from sqlalchemy.orm import relationship

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

    series = relationship("Series", secondary="series_tag", back_populates="tags")