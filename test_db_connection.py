import os
from dotenv import load_dotenv
import psycopg2

# Carrega as variáveis do .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}")

try:
    # Tenta conectar diretamente
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Conexão com PostgreSQL bem-sucedida!")

    # Cria um cursor
    cur = conn.cursor()

    # Testa uma query simples
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"PostgreSQL version: {version[0]}")

    # Lista as tabelas existentes
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """)
    tables = cur.fetchall()

    if tables:
        print(f"\nTabelas no banco 'BL':")
        for table in tables:
            print(f"  - {table[0]}")
    else:
        print("\n⚠ Nenhuma tabela encontrada no banco 'BL'")
        print("Você precisa criar as tabelas (usar Alembic ou Base.metadata.create_all())")

    # Fecha cursor e conexão
    cur.close()
    conn.close()

except Exception as e:
    print(f"❌ Erro ao conectar: {type(e).__name__}")
    print(f"Detalhes: {e}")
