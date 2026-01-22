import os
from app.core.security import verify_password

# Credenciais vindas do .env
ADMIN_LOGIN = os.getenv("ADMIN_LOGIN")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")


def authenticate_user(login: str, password: str) -> bool:
    """
    Valida login e senha contra as credenciais do .env
    """
    if not ADMIN_LOGIN or not ADMIN_PASSWORD_HASH:
        raise RuntimeError("Credenciais de administrador não configuradas")

    if login != ADMIN_LOGIN:
        return False

    return verify_password(password, ADMIN_PASSWORD_HASH)