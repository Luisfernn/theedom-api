import psycopg
from dotenv import load_dotenv
import os

load_dotenv()

conn = psycopg.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

cur = conn.cursor()
cur.execute("""
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'actors'
    ORDER BY ordinal_position
""")

print("Colunas da tabela 'actors':")
print("-" * 80)
for row in cur.fetchall():
    nullable = "NULL" if row[2] == 'YES' else "NOT NULL"
    default = f" DEFAULT {row[3]}" if row[3] else ""
    print(f"{row[0]:20} {row[1]:20} {nullable:10} {default}")

cur.close()
conn.close()
