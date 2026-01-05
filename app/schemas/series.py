from pydantic import BaseModel, Field, validator
from typing import Optional
import re


YEAR_MONTH_REGEX = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")


class SeriesBase(BaseModel):
    title: str = Field(..., example="Love in the Moonlight")
    status: Optional[str] = Field(None, example="completed")
    production_company: Optional[str] = Field(None, example="GMMTV")
    date_start: Optional[str] = Field(None, example="2023-08")
    date_watched: Optional[str] = Field(None, example="2023-09")

    @validator("date_start", "date_watched")
    def validate_year_month(cls, value):
        if value is None:
            return value

        if not YEAR_MONTH_REGEX.match(value):
            raise ValueError("Date must be in YYYY-MM format")

        return value


class SeriesCreate(SeriesBase):
    pass


class SeriesResponse(SeriesBase):
    id: int

    class Config:
        from_attributes = True