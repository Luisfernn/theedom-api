from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.routes.series import router as series_router
from app.api.routes.tags import router as tags_router
from app.api.routes.actors import router as actors_router
from app.api.routes.characters import router as characters_router
from app.api.routes.ship_actors import router as ship_actors_router
from app.api.routes.ship_characters import router as ship_characters_router
from app.auth.routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Theedom API",
    description="API para gerenciamento de series BL",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(series_router)
app.include_router(tags_router)
app.include_router(actors_router)
app.include_router(characters_router)
app.include_router(ship_actors_router)
app.include_router(ship_characters_router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Erro interno do servidor", "error": str(exc)}
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )