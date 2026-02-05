# Theedom API

API para gerenciamento de séries BL.

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

## Documentação

- **API Endpoints:** `/docs` (Swagger UI) ou `/redoc`
- **Banco de Dados:** [docs/DATABASE.md](docs/DATABASE.md)
- **Deploy AWS:** [docs/DEPLOY.md](docs/DEPLOY.md)
- **Variáveis de Ambiente:** [docs/.env.example](docs/.env.example)
