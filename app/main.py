from fastapi import FastAPI
from app.api.routes.series import router as series_router
from app.api.routes.tags import router as tags_router
from app.routes import auth
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.include_router(series_router)
app.include_router(tags_router)
app.include_router(auth.router)
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