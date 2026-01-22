from fastapi import FastAPI
from app.api.routes.series import router as series_router
from app.api.routes.tags import router as tags_router
from app.routes import auth


app = FastAPI()

app.include_router(series_router)
app.include_router(tags_router)
app.include_router(auth.router)


@app.get("/health")
def health():
    return {"status": "ok"}