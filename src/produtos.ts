import type { Produto } from "./types";
import { validaNome } from "./utils";

const produtos: Produto[] = [];

// cadastrar produto
function createProduto(produto: Produto): boolean {
  if (!validaNome(produto.nome) || !validaNome(produto.categoria)) {
    console.log("Erro: Nome e/ou Categoria do produto são obrigatórios.");
    return false;
  } else if (produto.preco < 0) {
    console.log("Erro: Preço deve ser maior que zero.");
    return false;
  } else if (produto.estoque < 0) {
    console.log("Erro: Estoque deve ser maior que zero.");
    return false;
  } else {
    produtos.push(produto);
    console.log("Cadastro de produto realizado com sucesso!");
    return true;
  }
}

// listar produtos
function readProduto(): Produto[] {
  return produtos;
}

export { createProduto, readProduto };
