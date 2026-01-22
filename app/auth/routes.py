from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.security import verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])


# Modelo de dados do login
class LoginRequest(BaseModel):
    login: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    # Credenciais fixas (apenas você)
    VALID_LOGIN = "Thee"
    HASHED_PASSWORD = "$2b$12$yWnFQ8Z9jmmY/R86hLs.pOp5Dll1Y9sqDzA8IaHICelZUzwvm2Ppq"
    # ↑ hash de exemplo (senha real você decide)

    if data.login != VALID_LOGIN:
        raise HTTPException(status_code=401, detail="Login inválido")

    if not verify_password(data.password, HASHED_PASSWORD):
        raise HTTPException(status_code=401, detail="Senha inválida")

    return {
        "message": "Login realizado com sucesso"
    }