from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    # Relationships
    series = relationship("Series", secondary="series_tag", back_populates="tags")
