# Vehicle Management API

REST API para gerenciamento de carros, motoristas e utilização de veículos.

## Tecnologias

- Node.js
- Express
- Jest
- Supertest
- JavaScript
- Persistência em memória

## Requisitos

- Node.js 18+
- npm

## Instalação

Clone o projeto:

```bash
git clone https://github.com/TH4LL3S/vehicle-management-api.git
cd vehicle-management-api
```

Instale as dependências:

```bash
npm install
```

## Executando a aplicação

Inicie o servidor:

```bash
npm start
```

A API estará disponível em:

```text
http://localhost:3000
```

Para executar em modo de desenvolvimento:

```bash
npm run dev
```

## Testes

Execute os testes automatizados:

```bash
npm test
```

O projeto possui 43 testes automatizados cobrindo os principais fluxos da aplicação.

## Como usar a API

O fluxo básico da aplicação é:

```text
Criar carro
    ↓
Criar motorista
    ↓
Criar utilização
    ↓
Consultar utilização
    ↓
Finalizar utilização
```

### 1. Verificar se a API está funcionando

```bash
curl http://localhost:3000/health
```

Resposta:

```json
{
  "status": "ok"
}
```

### 2. Criar um carro

```bash
curl -X POST http://localhost:3000/cars \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "ABC-1234",
    "color": "Preto",
    "brand": "Toyota"
  }'
```

Resposta:

```json
{
  "id": "ID_DO_CARRO",
  "plate": "ABC-1234",
  "color": "Preto",
  "brand": "Toyota"
}
```

Guarde o `id` retornado, pois ele será utilizado na criação da utilização.

### 3. Criar um motorista

```bash
curl -X POST http://localhost:3000/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva"
  }'
```

Resposta:

```json
{
  "id": "ID_DO_MOTORISTA",
  "name": "João Silva"
}
```

Guarde também o `id` retornado.

### 4. Criar uma utilização

Substitua `ID_DO_CARRO` e `ID_DO_MOTORISTA` pelos IDs obtidos anteriormente:

```bash
curl -X POST http://localhost:3000/usages \
  -H "Content-Type: application/json" \
  -d '{
    "carId": "ID_DO_CARRO",
    "driverId": "ID_DO_MOTORISTA",
    "reason": "Visita ao cliente"
  }'
```

Resposta:

```json
{
  "id": "ID_DA_UTILIZACAO",
  "startDate": "2026-10-06T22:00:00.000Z",
  "endDate": null,
  "driverId": "ID_DO_MOTORISTA",
  "carId": "ID_DO_CARRO",
  "reason": "Visita ao cliente"
}
```

Guarde o `id` da utilização para utilizá-lo posteriormente.

### 5. Listar utilizações

```bash
curl http://localhost:3000/usages
```

A resposta apresenta os dados da utilização junto com as informações do motorista e do veículo:

```json
[
  {
    "id": "ID_DA_UTILIZACAO",
    "startDate": "2026-10-06T22:00:00.000Z",
    "endDate": null,
    "reason": "Visita ao cliente",
    "driver": {
      "id": "ID_DO_MOTORISTA",
      "name": "João Silva"
    },
    "car": {
      "id": "ID_DO_CARRO",
      "plate": "ABC-1234",
      "color": "Preto",
      "brand": "Toyota"
    }
  }
]
```

### 6. Finalizar uma utilização

Substitua `ID_DA_UTILIZACAO` pelo ID retornado na criação da utilização:

```bash
curl -X PUT http://localhost:3000/usages/ID_DA_UTILIZACAO/finish
```

A aplicação preencherá automaticamente a data e hora de término.

Após a finalização, o carro e o motorista ficam disponíveis novamente.

## Endpoints

### Health

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/health` | Verifica se a API está funcionando |

### Carros

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/cars` | Criar carro |
| GET | `/cars` | Listar carros |
| GET | `/cars/:id` | Buscar carro por ID |
| PUT | `/cars/:id` | Atualizar carro |
| DELETE | `/cars/:id` | Excluir carro |

#### Filtros

Por cor:

```text
GET /cars?color=Preto
```

Por marca:

```text
GET /cars?brand=Toyota
```

Por cor e marca:

```text
GET /cars?color=Preto&brand=Toyota
```

### Motoristas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/drivers` | Criar motorista |
| GET | `/drivers` | Listar motoristas |
| GET | `/drivers/:id` | Buscar motorista por ID |
| PUT | `/drivers/:id` | Atualizar motorista |
| DELETE | `/drivers/:id` | Excluir motorista |

#### Filtro por nome

```text
GET /drivers?name=João
```

### Utilizações

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/usages` | Criar utilização |
| GET | `/usages` | Listar utilizações |
| GET | `/usages/:id` | Buscar utilização por ID |
| PUT | `/usages/:id/finish` | Finalizar utilização |

## Regras de negócio

### Carro

Um carro não pode ser utilizado simultaneamente por mais de um motorista.

Caso o carro já possua uma utilização ativa, a API retorna:

```http
409 Conflict
```

```json
{
  "error": "Car is already being used"
}
```

### Motorista

Um motorista não pode utilizar mais de um carro simultaneamente.

Caso o motorista já possua uma utilização ativa, a API retorna:

```http
409 Conflict
```

```json
{
  "error": "Driver is already using a car"
}
```

Após finalizar a utilização, o carro e o motorista ficam disponíveis novamente.

## Arquitetura

A aplicação utiliza separação de responsabilidades entre as camadas:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
```

### Routes

Responsáveis pelo mapeamento dos endpoints da API.

### Controllers

Responsáveis por receber as requisições HTTP e retornar as respostas.

### Services

Responsáveis pelas regras de negócio da aplicação.

### Repositories

Responsáveis pelo acesso e gerenciamento dos dados.

### Middleware

Responsável pelo tratamento centralizado dos erros.

### Tests

Contêm os testes automatizados utilizando Jest e Supertest.

## Estrutura do projeto

```text
src/
├── controllers/
│   ├── carController.js
│   ├── driverController.js
│   └── usageController.js
├── middlewares/
│   └── errorHandler.js
├── repositories/
│   ├── carRepository.js
│   ├── driverRepository.js
│   └── usageRepository.js
├── routes/
│   ├── carRoutes.js
│   ├── driverRoutes.js
│   └── usageRoutes.js
├── services/
│   ├── carService.js
│   ├── driverService.js
│   └── usageService.js
├── app.js
└── server.js

tests/
├── car.test.js
├── driver.test.js
├── health.test.js
└── usage.test.js
```

## Persistência

A aplicação utiliza persistência em memória.

Os dados permanecem disponíveis enquanto o servidor estiver em execução e são perdidos quando a aplicação é reiniciada.