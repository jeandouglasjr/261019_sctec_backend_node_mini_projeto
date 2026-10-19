import type { Produto } from "./types";

const produto: Produto[] = [];

function cadastrarProduto(produtos: Produto): void {
  produto.push(produtos);
}

function exibirProdutos(): Produto[] {
  return produto;
}

const novoProduto1: Produto = {
  id: 1,
  nome: "Notebook",
  categoria: "Eletrônicos",
  preco: 1000,
  estoque: 10,
};

cadastrarProduto(novoProduto1);

const novoProduto2: Produto = {
  id: 2,
  nome: "Mouse",
  categoria: "Eletrônicos",
  preco: 50,
  estoque: 50,
};

cadastrarProduto(novoProduto2);

const novoProduto3: Produto = {
  id: 3,
  nome: "Teclado",
  categoria: "Eletrônicos",
  preco: 100,
  estoque: 20,
};

cadastrarProduto(novoProduto3);

export { cadastrarProduto, exibirProdutos };
