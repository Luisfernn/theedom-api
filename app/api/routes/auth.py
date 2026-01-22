from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from app.services.auth_service import authenticate_user

router = APIRouter(prefix="/auth", tags=["Auth"])

# Armazenamento simples em memória
ACTIVE_TOKENS: set[str] = set()


class LoginRequest(BaseModel):
    login: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "simple"


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    is_valid = authenticate_user(data.login, data.password)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = str(uuid4())
    ACTIVE_TOKENS.add(token)

    return {
        "access_token": token,
        "token_type": "simple"
    }