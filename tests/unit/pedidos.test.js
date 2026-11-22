const { validarPedido, calcularTotal } = require('../../src/pedidos');

describe('calcularTotal', () => {
  test('soma preço x quantidade', () => {
    expect(calcularTotal([{ preco: '6.50', quantidade: 2 }, { preco: '4.00', quantidade: 1 }])).toBe(17);
  });
  test('não sofre erro de ponto flutuante', () => {
    expect(calcularTotal([{ preco: '0.10', quantidade: 3 }])).toBe(0.3);
  });
});

describe('validarPedido', () => {
  const ok = { cliente: 'Ana', itens: [{ item_id: 1, quantidade: 2 }] };
  test('aceita pedido válido', () => expect(validarPedido(ok)).toBeNull());
  test('rejeita sem cliente', () => expect(validarPedido({ ...ok, cliente: ' ' })).toMatch(/cliente/));
  test('rejeita lista de itens vazia', () => expect(validarPedido({ ...ok, itens: [] })).toMatch(/itens/));
  test('rejeita quantidade inválida', () => {
    expect(validarPedido({ ...ok, itens: [{ item_id: 1, quantidade: 0 }] })).toMatch(/quantidade/);
  });
  test('rejeita item_id não inteiro', () => {
    expect(validarPedido({ ...ok, itens: [{ item_id: '1', quantidade: 1 }] })).toMatch(/item_id/);
  });
});
