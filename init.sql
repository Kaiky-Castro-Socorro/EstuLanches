CREATE TABLE IF NOT EXISTS itens (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  disponivel BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(80) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'recebido',
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES itens(id),
  quantidade INT NOT NULL CHECK (quantidade > 0),
  preco_unit NUMERIC(10,2) NOT NULL
);

INSERT INTO itens (nome, preco) VALUES
  ('Coxinha', 6.50),
  ('Pão de queijo', 4.00),
  ('Suco natural', 5.50),
  ('Sanduíche natural', 9.00);
