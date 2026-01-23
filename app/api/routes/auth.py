from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from app.core.security import verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    login: str
    password: str


@router.post("/login")
def login(data: LoginRequest, response: Response):
    VALID_LOGIN = "Thee"
    HASHED_PASSWORD = "$2b$12$yWnFQ8Z9jmmY/R86hLs.pOp5Dll1Y9sqDzA8IaHICelZUzwvm2Ppq"

    if data.login != VALID_LOGIN:
        raise HTTPException(status_code=401, detail="Login inválido")

    if not verify_password(data.password, HASHED_PASSWORD):
        raise HTTPException(status_code=401, detail="Senha inválida")

    # ✅ Cookie simples de sessão
    response.set_cookie(
        key="session",
        value="authenticated",
        httponly=True,
        samesite="lax"
    )

    return {"message": "Login realizado com sucesso"}