import type { ItemCarrinho, RespostaOperacao, Produto } from "./types";
import { readProdutoPorId } from "./produtos";

// itens atuais no carrinho
const carrinho: ItemCarrinho[] = [];

// cadastrar item no carrinho
function createItemCarrinho(
  idProduto: number,
  quantidade: number,
): RespostaOperacao {
  // quantidade maior que zero
  if (isNaN(quantidade) || quantidade <= 0) {
    return {
      sucesso: false,
      mensagem: "ERRO: A QUANTIDADE INFORMADA DEVE SER MAIOR QUE ZERO.",
    };
  }

  // produto existe no catálogo
  const produto = readProdutoPorId(idProduto);
  if (!produto) {
    return {
      sucesso: false,
      mensagem: `ERRO: PRODUTO COM ID ${idProduto} NÃO EXISTE NO CATÁLOGO.`,
    };
  }

  // item está no carrinho?
  const itemExistente = carrinho.find((item) => item.idProduto === idProduto);

  if (itemExistente) {
    const quantidadeFinal = itemExistente.quantidade + quantidade;

    // valida estoque
    if (quantidadeFinal > produto.estoque) {
      return {
        sucesso: false,
        mensagem: `ERRO: QUANTIDADE TOTAL SOLICITADA (${quantidadeFinal}) EXCEDE O ESTOQUE DISPONÍVEL (${produto.estoque}) DE "${produto.nome.toUpperCase()}".`,
      };
    }

    itemExistente.quantidade = quantidadeFinal;
    return {
      sucesso: true,
      mensagem: `QUANTIDADE DO PRODUTO "${produto.nome.toUpperCase()}" ATUALIZADA PARA ${quantidadeFinal} NO CARRINHO.`,
    };
  } else {
    // valida estoque
    if (quantidade > produto.estoque) {
      return {
        sucesso: false,
        mensagem: `ERRO: QUANTIDADE SOLICITADA (${quantidade}) É SUPERIOR AO ESTOQUE DISPONÍVEL (${produto.estoque}) DE "${produto.nome.toUpperCase()}".`,
      };
    }

    carrinho.push({
      idProduto,
      quantidade,
    });

    return {
      sucesso: true,
      mensagem: `PRODUTO "${produto.nome.toUpperCase()}" (X${quantidade}) ADICIONADO AO CARRINHO COM SUCESSO.`,
    };
  }
}

// listar itens do carrinho
function readCarrinho(): ItemCarrinho[] {
  return [...carrinho];
}

// calcula preço total
function readSubtotalItem(item: ItemCarrinho): number {
  const produto = readProdutoPorId(item.idProduto);
  if (!produto) {
    return 0;
  }
  return produto.preco * item.quantidade;
}

// calcula valor total do carrinho
function readTotalCarrinho(): number {
  return carrinho.reduce((totalAcumulado, item) => {
    return totalAcumulado + readSubtotalItem(item);
  }, 0);
}

// listar itens do carrinho
function readItensCarrinho(): Array<{
  produto: Produto;
  quantidade: number;
  subtotal: number;
}> {
  return carrinho
    .map((item) => {
      const produto = readProdutoPorId(item.idProduto);
      if (!produto) {
        return null;
      }
      return {
        produto,
        quantidade: item.quantidade,
        subtotal: produto.preco * item.quantidade,
      };
    })
    .filter(
      (
        item,
      ): item is { produto: Produto; quantidade: number; subtotal: number } =>
        item !== null,
    );
}

// quantidade maio que zero e respeitar estoque
function updateItemCarrinho(
  idProduto: number,
  novaQuantidade: number,
): RespostaOperacao {
  if (isNaN(novaQuantidade) || novaQuantidade <= 0) {
    return {
      sucesso: false,
      mensagem: "ERRO: A QUANTIDADE DEVE SER MAIOR QUE ZERO.",
    };
  }

  const item = carrinho.find((it) => it.idProduto === idProduto);
  if (!item) {
    return {
      sucesso: false,
      mensagem: `ERRO: PRODUTO COM ID ${idProduto} NÃO ESTÁ NO CARRINHO.`,
    };
  }

  const produto = readProdutoPorId(idProduto);
  if (!produto) {
    return {
      sucesso: false,
      mensagem: `ERRO: PRODUTO COM ID ${idProduto} NÃO ENCONTRADO NO CATÁLOGO.`,
    };
  }

  if (novaQuantidade > produto.estoque) {
    return {
      sucesso: false,
      mensagem: `ERRO: QUANTIDADE (${novaQuantidade}) EXCEDE O ESTOQUE DISPONÍVEL (${produto.estoque}) DO PRODUTO "${produto.nome.toUpperCase()}".`,
    };
  }

  item.quantidade = novaQuantidade;
  return {
    sucesso: true,
    mensagem: `QUANTIDADE DE "${produto.nome.toUpperCase()}" ALTERADA PARA ${novaQuantidade}.`,
  };
}

// remove item do carrinho pelo id do produto
function deleteItemCarrinho(idProduto: number): RespostaOperacao {
  const indice = carrinho.findIndex((item) => item.idProduto === idProduto);

  if (indice === -1) {
    return {
      sucesso: false,
      mensagem: `ERRO: O PRODUTO COM ID ${idProduto} NÃO ESTÁ PRESENTE NO CARRINHO.`,
    };
  }

  carrinho.splice(indice, 1);
  return {
    sucesso: true,
    mensagem: `PRODUTO ID ${idProduto} REMOVIDO DO CARRINHO.`,
  };
}

// limpa carrinho
function deleteCarrinho(): void {
  carrinho.length = 0;
}

export {
  createItemCarrinho,
  readCarrinho,
  readSubtotalItem,
  readTotalCarrinho,
  readItensCarrinho,
  updateItemCarrinho,
  deleteItemCarrinho,
  deleteCarrinho,
};
