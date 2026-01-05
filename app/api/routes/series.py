from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.series import SeriesCreate, SeriesResponse
from app.services.series_service import create_series

router = APIRouter(prefix="/series", tags=["Series"])


@router.post(
    "",
    response_model=SeriesResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_series_endpoint(
    series_in: SeriesCreate,
    db: Session = Depends(get_db),
):
    try:
        series = create_series(db, **series_in.dict())
        return series

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )