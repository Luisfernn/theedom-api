import os
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# carrega o .env
load_dotenv()

# Configura encoding do PostgreSQL antes de criar conexões
os.environ['PGCLIENTENCODING'] = 'UTF8'

# Remove variáveis que podem causar problemas de encoding no Windows
os.environ.pop('PGPASSFILE', None)
os.environ.pop('PGSYSCONFDIR', None)

# Tenta ler parâmetros individuais primeiro (mais seguro no Windows)
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Se tiver parâmetros individuais, monta a URL
if all([DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD]):
    # Faz URL encoding da senha para evitar problemas com caracteres especiais (@, !, etc)
    encoded_password = quote_plus(DB_PASSWORD)
    # Usa psycopg3 (melhor suporte Windows)
    DATABASE_URL = f"postgresql+psycopg://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    # Fallback para DATABASE_URL direta
    DATABASE_URL = os.getenv("DATABASE_URL")
    # Se vier como postgresql://, converte para psycopg3
    if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL ou parâmetros DB_* não estão definidos no .env")

# Cria engine com configurações específicas para evitar problemas de encoding
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "options": "-c client_encoding=UTF8"
    },
    pool_pre_ping=True,  # Verifica se a conexão está viva antes de usar
    echo=False  # Desabilita logging SQL para produção
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()