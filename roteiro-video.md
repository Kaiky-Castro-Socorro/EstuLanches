# Roteiro do vídeo (meta: ~4min30s)

1. **0:00–0:30 Apresentação** – seu nome; EstuLanches resolve filas e anotação em papel na cantina: cardápio e pedidos digitais.
2. **0:30–1:30 Dockerfile e Compose** – multi-stage (base/test/prod), usuário não root, healthcheck; compose com db + app + tests (profile), healthcheck do Postgres, depends_on, volume pgdata, banco sem porta exposta.
3. **1:30–2:15 Código** – pedidos.js (regras puras), app.js (rotas, preço vindo do banco, transação).
4. **2:15–3:00 Testes** – rode `docker compose --profile test run --rm tests`; explique unitário (sem banco) vs integração (Postgres real).
5. **3:00–3:40 Sistema** – `docker compose ps`, `logs`, curl em /cardapio e POST /pedidos.
6. **3:40–4:00 Ficha RDM** – mostre o PDF.
7. **4:00–4:20 Segurança** – não root, .env, banco interno, helmet, validação, SQL parametrizado.
8. **4:20–5:00 Escalabilidade (conceitual)** – API stateless → várias réplicas atrás de load balancer (Kubernetes/ECS com autoscaling); Postgres gerenciado com réplicas de leitura + pool (PgBouncer); cache (Redis) para o cardápio; fila (SQS/RabbitMQ) para picos de pedidos; CDN; multi-região/AZ; observabilidade (métricas, logs, alertas). 100 mil simultâneos: ~ centenas de pods, cache absorve leituras.
