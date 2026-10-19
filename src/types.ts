type Cliente = {
  id: number;
  nome: string;
  email: string;
};

type ClienteList = {
  clientes: Cliente[];
};

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
};

type ProdutoList = {
  produtos: Produto[];
};

type Carrinho = {
  id: number;
  clienteId: number;
  produtos: Produto[];
  total: number;
};

type CarrinhoList = {
  carrinhos: Carrinho[];
};

type Pedido = {
  id: number;
  clienteId: number;
  produtos: Produto[];
  total: number;
};

type PedidoList = {
  pedidos: Pedido[];
};

export type { Cliente, Produto, ClienteList, ProdutoList };
