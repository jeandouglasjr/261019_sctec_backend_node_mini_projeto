import type { Produto, RespostaOperacao } from "./types";
import { validaNome } from "./utils";

// produtos pré cadastrados
const produtos: Produto[] = [
  {
    id: 1,
    nome: "TECLADO MECÂNICO RGB",
    categoria: "PERIFÉRICOS",
    preco: 250.0,
    estoque: 10,
  },
  {
    id: 2,
    nome: "MOUSE GAMER 16000 DPI",
    categoria: "PERIFÉRICOS",
    preco: 120.0,
    estoque: 15,
  },
  {
    id: 3,
    nome: "MONITOR 24 POL. 144HZ",
    categoria: "MONITORES",
    preco: 850.0,
    estoque: 5,
  },
  {
    id: 4,
    nome: "HEADSET USB 7.1",
    categoria: "ÁUDIO",
    preco: 180.0,
    estoque: 8,
  },
  {
    id: 5,
    nome: "CADEIRA GAMER RECLINÁVEL",
    categoria: "MÓVEIS",
    preco: 799.9,
    estoque: 4,
  },
];

// contador id sequencial
let proximoIdProduto: number = 6;

/**
 * [CREATE] Cadastra um novo produto aplicando todas as regras de negócio:
 * - O identificador de cada produto deve ser único.
 * - O nome não pode estar vazio.
 * - O preço deve ser maior que zero.
 * - O estoque não pode ser negativo.
 * - Não deve ser possível cadastrar um produto com identificador já utilizado.
 */

// criar produto
function createProduto(
  nome: string,
  categoria: string,
  preco: number,
  estoque: number,
  id?: number,
): RespostaOperacao<Produto> {
  // valida nome
  if (!validaNome(nome)) {
    return {
      sucesso: false,
      mensagem: "ERRO: O NOME DO PRODUTO NÃO PODE ESTAR VAZIO.",
    };
  }

  // valida categoria
  if (!validaNome(categoria)) {
    return {
      sucesso: false,
      mensagem: "ERRO: A CATEGORIA DO PRODUTO NÃO PODE ESTAR VAZIA.",
    };
  }

  // valida preço
  if (isNaN(preco) || preco <= 0) {
    return {
      sucesso: false,
      mensagem: "ERRO: O PREÇO DO PRODUTO DEVE SER UM VALOR MAIOR QUE ZERO.",
    };
  }

  // valida estoque
  if (isNaN(estoque) || estoque < 0) {
    return {
      sucesso: false,
      mensagem: "ERRO: O ESTOQUE NÃO PODE SER NEGATIVO.",
    };
  }

  // valida id único
  let idFinal: number;
  if (id !== undefined) {
    const idJaExiste = produtos.some((p) => p.id === id);
    if (idJaExiste) {
      return {
        sucesso: false,
        mensagem: `ERRO: JÁ EXISTE UM PRODUTO CADASTRADO COM O ID ${id}.`,
      };
    }
    idFinal = id;
    if (id >= proximoIdProduto) {
      proximoIdProduto = id + 1;
    }
  } else {
    idFinal = proximoIdProduto++;
  }

  const novoProduto: Produto = {
    id: idFinal,
    nome: nome.trim(),
    categoria: categoria.trim(),
    preco,
    estoque,
  };

  produtos.push(novoProduto);

  return {
    sucesso: true,
    mensagem: `PRODUTO "${novoProduto.nome}" CADASTRADO COM SUCESSO (ID: ${novoProduto.id}).`,
    dados: novoProduto,
  };
}

// listar produtos
function readProdutos(): Produto[] {
  return [...produtos];
}

// listar produtos por id
function readProdutoPorId(id: number): Produto | undefined {
  return produtos.find((produto) => produto.id === id);
}

// listar produtos por nome
function readProdutosPorNome(termo: string): Produto[] {
  const termoFormatado = termo.trim().toLowerCase();
  if (termoFormatado === "") {
    return [];
  }
  return produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoFormatado),
  );
}

//filtra protudos por categoria
function readProdutosPorCategoria(categoria: string): Produto[] {
  const categoriaFormatada = categoria.trim().toLowerCase();
  if (categoriaFormatada === "") {
    return [];
  }
  return produtos.filter(
    (produto) => produto.categoria.toLowerCase() === categoriaFormatada,
  );
}

// atualiza produto
function updateProduto(
  id: number,
  dados: {
    nome?: string;
    categoria?: string;
    preco?: number;
    estoque?: number;
  },
): RespostaOperacao<Produto> {
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return {
      sucesso: false,
      mensagem: `ERRO: PRODUTO COM ID ${id} NÃO ENCONTRADO.`,
    };
  }

  if (dados.nome !== undefined) {
    if (!validaNome(dados.nome)) {
      return {
        sucesso: false,
        mensagem: "ERRO: O NOME DO PRODUTO NÃO PODE FICAR VAZIO.",
      };
    }
    produto.nome = dados.nome.trim();
  }

  if (dados.categoria !== undefined) {
    if (!validaNome(dados.categoria)) {
      return {
        sucesso: false,
        mensagem: "ERRO: A CATEGORIA DO PRODUTO NÃO PODE FICAR VAZIA.",
      };
    }
    produto.categoria = dados.categoria.trim();
  }

  if (dados.preco !== undefined) {
    if (isNaN(dados.preco) || dados.preco <= 0) {
      return {
        sucesso: false,
        mensagem: "ERRO: O PREÇO DO PRODUTO DEVE SER MAIOR QUE ZERO.",
      };
    }
    produto.preco = dados.preco;
  }

  if (dados.estoque !== undefined) {
    if (isNaN(dados.estoque) || dados.estoque < 0) {
      return {
        sucesso: false,
        mensagem: "ERRO: O ESTOQUE NÃO PODE SER NEGATIVO.",
      };
    }
    produto.estoque = dados.estoque;
  }

  return {
    sucesso: true,
    mensagem: `PRODUTO ID ${id} ATUALIZADO COM SUCESSO.`,
    dados: produto,
  };
}

// controla estoque
function updateReduzirEstoque(id: number, quantidade: number): boolean {
  const produto = produtos.find((p) => p.id === id);
  if (!produto || produto.estoque < quantidade) {
    return false;
  }
  produto.estoque -= quantidade;
  return true;
}

// exclui protudo
function deleteProduto(id: number): RespostaOperacao {
  const indice = produtos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return {
      sucesso: false,
      mensagem: `ERRO: PRODUTO COM ID ${id} NÃO ENCONTRADO PARA REMOÇÃO.`,
    };
  }

  const [removido] = produtos.splice(indice, 1);
  return {
    sucesso: true,
    mensagem: `PRODUTO "${removido?.nome ?? id}" REMOVIDO COM SUCESSO.`,
  };
}

export {
  createProduto,
  readProdutos,
  readProdutoPorId,
  readProdutosPorNome,
  readProdutosPorCategoria,
  updateProduto,
  updateReduzirEstoque,
  deleteProduto,
};
