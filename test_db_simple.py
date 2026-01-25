import os
import sys

# Define encoding para UTF-8 antes de qualquer import
os.environ['PGCLIENTENCODING'] = 'UTF8'
os.environ['LANG'] = 'en_US.UTF-8'

# Desabilita arquivos de configuração do PostgreSQL que podem causar problema
os.environ.pop('PGPASSFILE', None)
os.environ.pop('PGSYSCONFDIR', None)
os.environ.pop('PGHOME', None)

from dotenv import load_dotenv
import psycopg2

load_dotenv()

try:
    # Conecta usando parâmetros diretos em vez da DATABASE_URL
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="BL",
        user="postgres",
        password="password",
        options="-c client_encoding=UTF8"
    )
    print("Conexao bem-sucedida!")

    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"PostgreSQL version: {version[0][:50]}...")

    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = cur.fetchall()

    if tables:
        print(f"\nTabelas encontradas ({len(tables)}):")
        for table in tables:
            print(f"  - {table[0]}")
    else:
        print("\nNenhuma tabela encontrada. O banco existe mas esta vazio.")

    cur.close()
    conn.close()

except Exception as e:
    print(f"Erro: {type(e).__name__}: {str(e)}")
