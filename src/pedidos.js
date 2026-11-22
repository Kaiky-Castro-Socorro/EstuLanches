// Regras de negócio puras (sem banco) -> fáceis de testar com testes unitários.

function validarPedido(body) {
  if (!body || typeof body.cliente !== 'string' || !body.cliente.trim()) {
    return 'cliente é obrigatório';
  }
  if (body.cliente.length > 80) return 'cliente deve ter no máximo 80 caracteres';
  if (!Array.isArray(body.itens) || body.itens.length === 0) {
    return 'itens deve ser uma lista não vazia';
  }
  if (body.itens.length > 30) return 'máximo de 30 itens por pedido';
  for (const it of body.itens) {
    if (!Number.isInteger(it.item_id) || it.item_id <= 0) return 'item_id inválido';
    if (!Number.isInteger(it.quantidade) || it.quantidade < 1 || it.quantidade > 50) {
      return 'quantidade deve ser inteiro entre 1 e 50';
    }
  }
  return null;
}

// Calcula em centavos para evitar erro de ponto flutuante.
function calcularTotal(linhas) {
  const centavos = linhas.reduce(
    (soma, l) => soma + Math.round(Number(l.preco) * 100) * l.quantidade,
    0
  );
  return centavos / 100;
}

module.exports = { validarPedido, calcularTotal };
