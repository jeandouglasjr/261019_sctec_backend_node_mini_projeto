// CLIENTE

type Cliente = {
  id: number;
  nome: string;
  email: string;
};

type readCliente = {
  clientes: Cliente[];
};

// PRODUTO

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
};

type readProduto = {
  produtos: Produto[];
};

// CARRINHO
type Carrinho = {
  id: number;
  clienteId: number;
  produtos: Produto[];
  total: number;
};

type readCarrinho = {
  carrinhos: Carrinho[];
};

// PEDIDO
type Pedido = {
  id: number;
  clienteId: number;
  produtos: Produto[];
  total: number;
};

type readPedido = {
  pedidos: Pedido[];
};

export type {
  Cliente,
  readCliente,
  Produto,
  readProduto,
  Carrinho,
  readCarrinho,
  Pedido,
  readPedido,
};
