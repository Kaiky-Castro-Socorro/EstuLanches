const express = require('express');
const helmet = require('helmet');
const { validarPedido, calcularTotal } = require('./pedidos');

function createApp(pool) {
  const app = express();
  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'banco_indisponivel' });
    }
  });

  app.get('/cardapio', async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, nome, preco FROM itens WHERE disponivel ORDER BY id'
      );
      res.json(rows);
    } catch (e) { next(e); }
  });

  app.post('/pedidos', async (req, res, next) => {
    const erro = validarPedido(req.body);
    if (erro) return res.status(400).json({ erro });

    const { cliente, itens } = req.body;
    const ids = [...new Set(itens.map((i) => i.item_id))];
    const client = await pool.connect();
    try {
      // Preço vem SEMPRE do banco, nunca do cliente.
      const { rows } = await client.query(
        'SELECT id, preco FROM itens WHERE id = ANY($1) AND disponivel',
        [ids]
      );
      if (rows.length !== ids.length) {
        return res.status(400).json({ erro: 'item inexistente ou indisponível' });
      }
      const precos = new Map(rows.map((r) => [r.id, r.preco]));
      const linhas = itens.map((i) => ({
        item_id: i.item_id,
        quantidade: i.quantidade,
        preco: precos.get(i.item_id),
      }));
      const total = calcularTotal(linhas);

      await client.query('BEGIN');
      const ped = await client.query(
        'INSERT INTO pedidos (cliente, total) VALUES ($1, $2) RETURNING id, status',
        [cliente.trim(), total]
      );
      for (const l of linhas) {
        await client.query(
          'INSERT INTO pedido_itens (pedido_id, item_id, quantidade, preco_unit) VALUES ($1,$2,$3,$4)',
          [ped.rows[0].id, l.item_id, l.quantidade, l.preco]
        );
      }
      await client.query('COMMIT');
      res.status(201).json({ id: ped.rows[0].id, status: ped.rows[0].status, total });
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      next(e);
    } finally {
      client.release();
    }
  });

  app.get('/pedidos/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'id inválido' });
    try {
      const { rows } = await pool.query(
        'SELECT id, cliente, total, status, criado_em FROM pedidos WHERE id = $1',
        [id]
      );
      if (!rows.length) return res.status(404).json({ erro: 'pedido não encontrado' });
      res.json(rows[0]);
    } catch (e) { next(e); }
  });

  // Não vaza detalhes internos ao cliente.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('[erro]', err.message);
    res.status(500).json({ erro: 'erro interno' });
  });

  return app;
}

module.exports = { createApp };
