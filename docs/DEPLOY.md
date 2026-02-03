# Deploy AWS

Guia para fazer deploy do backend no AWS Lambda e frontend no S3.

## Arquitetura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  S3 (Front) │     │  Supabase   │
└─────────────┘     └─────────────┘     │ (PostgreSQL)│
      │                                  └─────────────┘
      │                                        ▲
      ▼                                        │
┌─────────────┐     ┌─────────────┐            │
│ API Gateway │────▶│   Lambda    │────────────┘
└─────────────┘     └─────────────┘
```

---

## Backend (AWS Lambda)

### 1. Criar o pacote ZIP

No terminal, na raiz do projeto:

```bash
# Criar pasta temporária para o pacote
mkdir -p package

# Instalar dependências na pasta
pip install -r requirements.txt -t ./package

# Entrar na pasta e criar ZIP
cd package
zip -r ../theedom-lambda.zip .
cd ..

# Adicionar handler.py ao ZIP
zip theedom-lambda.zip handler.py

# Adicionar pasta app/ ao ZIP
zip -r theedom-lambda.zip app/
```

O arquivo `theedom-lambda.zip` estará pronto.

### 2. Criar função Lambda

1. Acesse o [AWS Lambda Console](https://console.aws.amazon.com/lambda)
2. Clique em **Create function**
3. Selecione **Author from scratch**
4. Configure:
   - **Function name:** `theedom-api`
   - **Runtime:** Python 3.11
   - **Architecture:** x86_64
5. Clique em **Create function**

### 3. Upload do código

1. Na página da função, vá em **Code**
2. Clique em **Upload from** → **.zip file**
3. Selecione `theedom-lambda.zip`
4. Clique em **Save**

### 4. Configurar handler

1. Em **Runtime settings**, clique em **Edit**
2. Configure o **Handler** como: `handler.handler`
3. Clique em **Save**

### 5. Variáveis de ambiente

1. Vá em **Configuration** → **Environment variables**
2. Clique em **Edit** e adicione:

| Key | Value |
|-----|-------|
| DB_HOST | seu-host.supabase.co |
| DB_PORT | 5432 |
| DB_NAME | postgres |
| DB_USER | postgres |
| DB_PASSWORD | sua-senha |
| ADMIN_LOGIN | seu-login |
| ADMIN_PASSWORD_HASH | hash-bcrypt |

3. Clique em **Save**

### 6. Configurar timeout e memória

1. Vá em **Configuration** → **General configuration**
2. Clique em **Edit**
3. Configure:
   - **Memory:** 256 MB (ou mais se necessário)
   - **Timeout:** 30 seconds
4. Clique em **Save**

### 7. Criar API Gateway

1. Acesse o [API Gateway Console](https://console.aws.amazon.com/apigateway)
2. Clique em **Create API**
3. Selecione **HTTP API** → **Build**
4. Configure:
   - **Add integration:** Lambda
   - **Lambda function:** theedom-api
   - **API name:** theedom-api
5. Em **Routes**, configure:
   - **Method:** ANY
   - **Resource path:** /{proxy+}
6. Clique em **Create**

### 8. Configurar CORS no API Gateway

1. Na API criada, vá em **CORS**
2. Configure:
   - **Access-Control-Allow-Origin:** * (ou seu domínio S3)
   - **Access-Control-Allow-Methods:** *
   - **Access-Control-Allow-Headers:** *
3. Clique em **Save**

### 9. Obter URL da API

A URL estará em **Stages** → **$default** → **Invoke URL**

Exemplo: `https://abc123.execute-api.us-east-1.amazonaws.com`

---

## Frontend (AWS S3)

### 1. Criar bucket S3

1. Acesse o [S3 Console](https://console.aws.amazon.com/s3)
2. Clique em **Create bucket**
3. Configure:
   - **Bucket name:** theedom-frontend (ou outro nome único)
   - **Region:** mesma região do Lambda
   - Desmarque **Block all public access**
4. Clique em **Create bucket**

### 2. Configurar hospedagem estática

1. No bucket, vá em **Properties**
2. Em **Static website hosting**, clique em **Edit**
3. Configure:
   - **Enable**
   - **Index document:** index.html
   - **Error document:** index.html
4. Clique em **Save changes**

### 3. Configurar política de acesso público

1. Vá em **Permissions** → **Bucket policy**
2. Adicione a política:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::theedom-frontend/*"
        }
    ]
}
```

3. Clique em **Save changes**

### 4. Atualizar API_BASE_URL no frontend

Antes de fazer upload, edite `front-end/js/config.js` (ou onde estiver definido):

```javascript
const API_BASE_URL = 'https://abc123.execute-api.us-east-1.amazonaws.com';
```

### 5. Upload dos arquivos

1. No bucket, clique em **Upload**
2. Faça upload das pastas:
   - `front-end/html/` → conteúdo na raiz do bucket
   - `front-end/css/` → pasta css/
   - `front-end/js/` → pasta js/
   - `front-end/images/` → pasta images/

Estrutura no bucket:
```
/
├── index.html
├── login.html
├── bl-list.html
├── ...
├── css/
├── js/
└── images/
```

### 6. Acessar o site

A URL estará em **Properties** → **Static website hosting** → **Bucket website endpoint**

Exemplo: `http://theedom-frontend.s3-website-us-east-1.amazonaws.com`

---

## Atualizações

### Atualizar Backend

1. Recrie o ZIP com as mudanças
2. Faça upload novamente no Lambda

### Atualizar Frontend

1. Faça upload dos arquivos alterados no S3
2. Se necessário, invalide cache do CloudFront (se estiver usando)

---

## Troubleshooting

### Erro 500 no Lambda
- Verifique os logs em **CloudWatch** → **Log groups** → `/aws/lambda/theedom-api`
- Confirme que as variáveis de ambiente estão corretas

### CORS Error no Frontend
- Verifique configuração de CORS no API Gateway
- Confirme que a URL da API está correta no frontend

### Timeout
- Aumente o timeout do Lambda (máximo 15 minutos)
- Verifique conexão com o banco de dados
