# Theedom API

API para gerenciamento de séries BL (Boys' Love).

## Tech Stack

- **Backend:** FastAPI + SQLAlchemy + PostgreSQL
- **Frontend:** HTML/CSS/JavaScript (vanilla)
- **Deploy:** AWS Lambda (Mangum) + S3

## Estrutura do Projeto

```
bl_api/
├── app/                    # Aplicação FastAPI
│   ├── main.py             # Inicialização da app
│   ├── api/routes/         # Endpoints da API
│   ├── models/             # Models SQLAlchemy
│   ├── schemas/            # Schemas Pydantic
│   ├── services/           # Lógica de negócio
│   ├── core/               # Configurações (database, security)
│   └── auth/               # Autenticação
├── front-end/              # Frontend estático
│   ├── html/               # Páginas HTML
│   ├── css/                # Estilos
│   ├── js/                 # JavaScript
│   └── images/             # Imagens
├── docs/                   # Documentação adicional
├── handler.py              # Handler AWS Lambda (Mangum)
└── requirements.txt        # Dependências Python
```

## Pré-requisitos

- Python 3.11+
- PostgreSQL
- Conta AWS (para deploy)

## Instalação Local

1. Clone o repositório:
```bash
git clone <repo-url>
cd bl_api
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
cp docs/.env.example .env
# Edite .env com suas credenciais
```

5. Rode o servidor:
```bash
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DB_HOST` | Host do PostgreSQL |
| `DB_PORT` | Porta do PostgreSQL |
| `DB_NAME` | Nome do banco de dados |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `ADMIN_LOGIN` | Login do admin |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt da senha |

## API Endpoints

| Rota | Descrição |
|------|-----------|
| `POST /auth/login` | Autenticação |
| `GET/POST /series` | Listar/Criar séries |
| `GET /series/{id}` | Detalhes da série |
| `POST /series/{id}/tags` | Adicionar tags |
| `POST /series/{id}/actors` | Adicionar atores |
| `POST /series/{id}/characters` | Adicionar personagens |
| `GET/POST /actors` | Listar/Criar atores |
| `GET/POST /characters` | Listar/Criar personagens |
| `GET/POST /tags` | Listar/Criar tags |
| `GET /health` | Health check |

## Deploy AWS Lambda

1. Crie o pacote ZIP:
```bash
# Copie dependências para pasta
pip install -r requirements.txt -t ./package
cd package
zip -r ../theedom-lambda.zip .
cd ..
zip theedom-lambda.zip handler.py
zip -r theedom-lambda.zip app/
```

2. Faça upload do ZIP no AWS Lambda

3. Configure o handler como: `handler.handler`

4. Adicione as variáveis de ambiente no Lambda

5. Configure o API Gateway

## Frontend (S3)

O frontend está em `front-end/` e deve ser hospedado no S3:

1. Faça upload de `html/`, `css/`, `js/`, `images/` para o bucket S3
2. Configure o bucket para hospedagem de site estático
3. Atualize `API_BASE_URL` nos arquivos JS para apontar para sua API

## Documentação Interativa

Com o servidor rodando, acesse:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
