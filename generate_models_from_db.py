"""
Script para gerar models SQLAlchemy automaticamente a partir do banco de dados existente
"""
import psycopg
from dotenv import load_dotenv
import os

load_dotenv()

# Conecta ao banco
conn = psycopg.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

cur = conn.cursor()

# Pega todas as tabelas
cur.execute("""
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
""")

tables = [row[0] for row in cur.fetchall()]

print(f"Encontradas {len(tables)} tabelas no banco 'BL':\n")

# Mapeia tipos PostgreSQL para SQLAlchemy
type_mapping = {
    'integer': 'Integer',
    'bigint': 'BigInteger',
    'character varying': 'String',
    'varchar': 'String',
    'text': 'Text',
    'boolean': 'Boolean',
    'date': 'Date',
    'timestamp without time zone': 'DateTime',
    'timestamp with time zone': 'DateTime',
    'numeric': 'Numeric',
    'real': 'Float',
    'double precision': 'Float',
}

for table_name in tables:
    print(f"\n{'='*80}")
    print(f"Tabela: {table_name}")
    print('='*80)

    # Pega colunas da tabela
    cur.execute(f"""
        SELECT
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length
        FROM information_schema.columns
        WHERE table_name = '{table_name}'
        ORDER BY ordinal_position
    """)

    columns = cur.fetchall()

    # Pega chaves primárias
    cur.execute(f"""
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = '{table_name}'::regclass
        AND i.indisprimary
    """)
    primary_keys = [row[0] for row in cur.fetchall()]

    # Pega foreign keys
    cur.execute(f"""
        SELECT
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = '{table_name}'
    """)
    foreign_keys = {row[0]: (row[1], row[2]) for row in cur.fetchall()}

    print(f"\nColunas ({len(columns)}):")
    for col in columns:
        col_name, data_type, is_nullable, default, max_length = col
        nullable = "NULL" if is_nullable == 'YES' else "NOT NULL"
        pk = " [PK]" if col_name in primary_keys else ""
        fk = f" [FK -> {foreign_keys[col_name][0]}.{foreign_keys[col_name][1]}]" if col_name in foreign_keys else ""
        print(f"  - {col_name:20} {data_type:20} {nullable:10}{pk}{fk}")

cur.close()
conn.close()

print(f"\n{'='*80}")
print("Analise completa!")
