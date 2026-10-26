// CLIENTE

type Cliente = {
  id: number;
  nome: string;
  email: string;
};

// PRODUTO

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
};

// CARRINHO
type Carrinho = {
  id: number;
  clienteId: number;
  produtos: Produto[];
  total: number;
};

// PEDIDO
type Pedido = {
  id: number;
  clienteId: number;
  produtos: Produto[];
  total: number;
  data: Date;
};

export type { Cliente, Produto, Carrinho, Pedido };
