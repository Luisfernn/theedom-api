import psycopg
from dotenv import load_dotenv
import os

load_dotenv()

try:
    conn = psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
    print("Conexao bem-sucedida com psycopg3!")

    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"PostgreSQL: {version[0][:60]}...")

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
    print("\nTESTE PASSOU! Banco conectado com sucesso.")

except Exception as e:
    print(f"ERRO: {str(e)[:200]}")
