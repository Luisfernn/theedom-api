from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base


class ShipCharacterSeries(Base):
    __tablename__ = "ship_characters_series"

    id = Column(Integer, primary_key=True)

    series_id = Column(
        Integer,
        ForeignKey("series.id", ondelete="CASCADE"),
        nullable=False
    )

    character_1_id = Column(
        Integer,
        ForeignKey("characters.id", ondelete="CASCADE"),
        nullable=False
    )

    character_2_id = Column(
        Integer,
        ForeignKey("characters.id", ondelete="CASCADE"),
        nullable=False
    )

    # 🔗 Relationships
    series = relationship("Series", back_populates="ships")
    character_1 = relationship("Character", foreign_keys=[character_1_id])
    character_2 = relationship("Character", foreign_keys=[character_2_id])