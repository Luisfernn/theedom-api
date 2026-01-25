from fastapi import FastAPI
from app.api.routes.series import router as series_router
from app.api.routes.tags import router as tags_router
from app.api.routes.actors import router as actors_router
from app.api.routes.characters import router as characters_router
from app.auth.routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.include_router(auth_router)
app.include_router(series_router)
app.include_router(tags_router)
app.include_router(actors_router)
app.include_router(characters_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}