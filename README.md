# EstuLanches

API de gestão de cardápio e pedidos da cantina escolar.
Stack: Node.js 20 + Express + PostgreSQL 16, empacotado com Docker.

## Rodar (PowerShell)

```powershell
Copy-Item .env.example .env        # edite a senha do banco
docker compose up -d --build
docker compose ps
docker compose logs db
docker compose logs app
```

## Testar o sistema

```powershell
curl.exe http://localhost:3000/health
curl.exe http://localhost:3000/cardapio
curl.exe -X POST http://localhost:3000/pedidos -H "Content-Type: application/json" -d '{\"cliente\":\"Ana\",\"itens\":[{\"item_id\":1,\"quantidade\":2}]}'
```

## Testes automatizados

```powershell
docker compose --profile test run --rm tests
# só unitários / só integração:
docker compose --profile test run --rm tests npm run test:unit
docker compose --profile test run --rm tests npm run test:integration
```

## Endpoints
| Método | Rota | Descrição |
|---|---|---|
| GET | /health | Estado da API e do banco |
| GET | /cardapio | Lista itens disponíveis |
| POST | /pedidos | Cria pedido (`cliente`, `itens[]`) |
| GET | /pedidos/:id | Consulta pedido |

## Segurança
- Container roda como usuário `node` (não root); imagem Alpine multi-stage sem devDependencies.
- Banco sem porta publicada; só a API o acessa pela rede interna do compose.
- Segredos em `.env` (fora do Git); `.env.example` versionado.
- Helmet (headers HTTP), limite de body (10kb), validação de entrada, queries parametrizadas (anti SQL injection).
- Preço calculado no servidor; erros internos não são expostos ao cliente.
