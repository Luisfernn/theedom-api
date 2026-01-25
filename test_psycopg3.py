import psycopg
from dotenv import load_dotenv
import os

load_dotenv()

try:
    # Tenta conectar com psycopg3
    conn = psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
    print("✓ Conexao bem-sucedida com psycopg3!")

    # Testa uma query
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"PostgreSQL: {version[0][:60]}...")

    # Lista tabelas
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
    """)
    tables = cur.fetchall()

    if tables:
        print(f"\nTabelas encontradas ({len(tables)}):")
        for table in tables:
            print(f"  - {table[0]}")
    else:
        print("\nNenhuma tabela encontrada.")

    cur.close()
    conn.close()

except Exception as e:
    print(f"Erro: {type(e).__name__}: {e}")
