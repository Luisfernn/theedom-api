from sqlalchemy import Column, Integer, String
from app.models.base import Base

class Series(Base):
    __tablename__ = "series"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    country = Column(String, nullable=False)

    status = Column(String, nullable=True)
    production_company = Column(String, nullable=True)

    date_start = Column(String, nullable=True)      
    date_watched = Column(String, nullable=True)