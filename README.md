# Desafio Green

Sistema para importar boletos em CSV, relacioná-los com lotes, dividir PDFs, consultar boletos com filtros e gerar relatórios em PDF (base64).

## 🚀 Tecnologias

- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL
- Docker / Docker Compose
- PDF-lib (para manipulação de PDFs)
- Multer (upload de arquivos)

---

## ⚙️ Instalação

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/desafio-green.git
cd desafio-green
```
### 2. Instalar as Dependências do Node.js

Primeiramente, navegue até a raiz do projeto em seu terminal e execute o seguinte comando para instalar todas as dependências listadas no arquivo `package.json`:

```bash
npm i
```
### 3. Suba o banco de dados com Docker
```bash
docker compose up
```
### 4. Configure o banco
```bash
# Rodar as migrations
npx sequelize-cli db:migrate

# Rodar o seeder para gerar a ordem fixa dos boletos no PDF
npx sequelize-cli db:seed:all
```
## 📤 Endpoints
### Realizar os testes de Endpoints em ordem no postman, no link abaixo:
https://www.postman.com/navigation-engineer-43941122/workspace/greenacessoteste/collection/28891122-d789c1ae-dfa7-4a0b-805c-a1c2e2d7a7a4?action=share&creator=28891122

#### Atividade 1 e 2 - Envia .csv e adiciona no db
POST /boletos/importar-csv
#### Atividade 3 - Envia PDF e Divide PDF
POST /boletos/dividir-pdf
#### Atividade 4 - Get Boletos básico
GET /boletos
#### Atividade 4 - Get Boletos com filtro
GET /boletos/?nome=Jose&valor_inicial=100&valor_final=200&id_lote=3
#### Atividade 5 - Get Boletos com filtro relatorio (gerar relatórios em PDF (base64))
GET /boletos/?relatorio=1
