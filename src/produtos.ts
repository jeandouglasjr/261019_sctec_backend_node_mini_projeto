import type { Produto } from "./types";

const produtos: Produto[] = [];

// cadastrar produto
function createProduto(produto: Produto): void {
  produtos.push(produto);
}

// listar produtos
function readProduto(): Produto[] {
  return produtos;
}

export { createProduto, readProduto };
