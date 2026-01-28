import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.security import verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

# Credenciais do admin via variáveis de ambiente
VALID_LOGIN = os.getenv("ADMIN_LOGIN")
HASHED_PASSWORD = os.getenv("ADMIN_PASSWORD_HASH")

if not VALID_LOGIN or not HASHED_PASSWORD:
    raise ValueError("ADMIN_LOGIN e ADMIN_PASSWORD_HASH devem estar definidos no .env")


# Modelo de dados do login
class LoginRequest(BaseModel):
    login: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    if data.login != VALID_LOGIN:
        raise HTTPException(status_code=401, detail="Login inválido")

    if not verify_password(data.password, HASHED_PASSWORD):
        raise HTTPException(status_code=401, detail="Senha inválida")

    return {
        "message": "Login realizado com sucesso"
    }