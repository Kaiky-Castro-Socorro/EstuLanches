// Usa o PostgreSQL real do docker compose (DATABASE_URL).
const request = require('supertest');
const pool = require('../../src/db');
const { createApp } = require('../../src/app');

const app = createApp(pool);
afterAll(() => pool.end());

test('GET /health retorna ok com banco conectado', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});

test('GET /cardapio lista os itens do seed', async () => {
  const res = await request(app).get('/cardapio');
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThanOrEqual(4);
});

test('POST /pedidos cria pedido com total calculado no servidor', async () => {
  const res = await request(app)
    .post('/pedidos')
    .send({ cliente: 'Teste', itens: [{ item_id: 1, quantidade: 2 }, { item_id: 2, quantidade: 1 }] });
  expect(res.status).toBe(201);
  expect(res.body.total).toBe(17); // 2 x 6,50 + 1 x 4,00

  const busca = await request(app).get(`/pedidos/${res.body.id}`);
  expect(busca.status).toBe(200);
  expect(busca.body.cliente).toBe('Teste');
});

test('POST /pedidos rejeita item inexistente', async () => {
  const res = await request(app)
    .post('/pedidos')
    .send({ cliente: 'Teste', itens: [{ item_id: 9999, quantidade: 1 }] });
  expect(res.status).toBe(400);
});

test('GET /pedidos/:id inexistente retorna 404', async () => {
  const res = await request(app).get('/pedidos/999999');
  expect(res.status).toBe(404);
});
