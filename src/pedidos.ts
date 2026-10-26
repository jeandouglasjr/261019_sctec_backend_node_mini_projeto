import type { Pedido, ItemPedido, RespostaOperacao } from "./types";
import { readClientePorId } from "./clientes";
import { readProdutoPorId, updateReduzirEstoque } from "./produtos";
import { readCarrinho, deleteCarrinho } from "./carrinho";

// pedidos realizados
const pedidos: Pedido[] = [];

// contador para geração de IDs únicos
let proximoIdPedido: number = 1;

function createPedido(idCliente: number): RespostaOperacao<Pedido> {
  // 1. validação cliente
  const cliente = readClientePorId(idCliente);
  if (!cliente) {
    return {
      sucesso: false,
      mensagem: `ERRO: CLIENTE COM ID ${idCliente} NÃO EXISTE NO SISTEMA.`,
    };
  }

  // 2. validação dos itens do carrinho
  const itensCarrinho = readCarrinho();
  if (itensCarrinho.length === 0) {
    return {
      sucesso: false,
      mensagem:
        "ERRO: O CARRINHO ESTÁ VAZIO. NÃO É POSSÍVEL FINALIZAR UM PEDIDO SEM ITENS.",
    };
  }

  // 3. validação prévia de TODOS os itens antes de alterar qualquer estoque
  for (const item of itensCarrinho) {
    const produto = readProdutoPorId(item.idProduto);

    if (!produto) {
      return {
        sucesso: false,
        mensagem: `ERRO: PRODUTO COM ID ${item.idProduto} NÃO FOI ENCONTRADO NO CATÁLOGO. A COMPRA FOI CANCELADA.`,
      };
    }

    if (produto.estoque < item.quantidade) {
      return {
        sucesso: false,
        mensagem: `ERRO: ESTOQUE INSUFICIENTE PARA O PRODUTO "${produto.nome.toUpperCase()}". DISPONÍVEL: ${produto.estoque}, SOLICITADO: ${item.quantidade}. O PEDIDO NÃO FOI REGISTRADO.`,
      };
    }
  }

  // 4. se todos os itens foram validados com sucesso, realiza a dedução do estoque e monta os itens do pedido
  const itensPedido: ItemPedido[] = [];
  let totalPedido = 0;

  for (const item of itensCarrinho) {
    const produto = readProdutoPorId(item.idProduto)!;

    // deduz estoque
    updateReduzirEstoque(produto.id, item.quantidade);

    // registra item com preço congelado no momento da compra
    const subtotal = produto.preco * item.quantidade;
    totalPedido += subtotal;

    itensPedido.push({
      idProduto: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
      subtotal,
    });
  }

  // 5. criação do pedido com ID único e data atual
  const novoPedido: Pedido = {
    id: proximoIdPedido++,
    idCliente: cliente.id,
    itens: itensPedido,
    total: totalPedido,
    data: new Date(),
  };

  pedidos.push(novoPedido);

  // 6. esvazia o carrinho de compras
  deleteCarrinho();

  return {
    sucesso: true,
    mensagem: `PEDIDO #${novoPedido.id} FINALIZADO COM SUCESSO PARA ${cliente.nome.toUpperCase()}! TOTAL: R$ ${totalPedido.toFixed(2).replace(".", ",")}.`,
    dados: novoPedido,
  };
}

// Listar todos os pedidos
function readPedidos(): Pedido[] {
  return [...pedidos];
}

// Buscar pedido por id do pedido
function readPedidoPorId(id: number): Pedido | undefined {
  return pedidos.find((pedido) => pedido.id === id);
}

// Buscar pedido por id do cliente
function readPedidosPorCliente(idCliente: number): Pedido[] {
  return pedidos.filter((pedido) => pedido.idCliente === idCliente);
}

export { createPedido, readPedidos, readPedidoPorId, readPedidosPorCliente };
