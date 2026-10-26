export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export interface ItemCarrinho {
  idProduto: number;
  quantidade: number;
}

export interface ItemPedido {
  idProduto: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  idCliente: number;
  itens: ItemPedido[];
  total: number;
  data: Date;
}

export interface RespostaOperacao<T = void> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
}
