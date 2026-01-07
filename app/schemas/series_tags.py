from pydantic import BaseModel
from typing import List


class SeriesTagsAdd(BaseModel):
    tags: List[str]