import promptSync = require("prompt-sync"); // importar o prompt-sync para entrada de dados
import { createCliente, readCliente } from "./clientes"; // importar as funções de cadastro e leitura de clientes
import { createProduto, readProduto } from "./produtos"; // importar as funções de cadastro e leitura de produtos
import type { Cliente, Produto } from "./types"; // importar o tipo cliente

const prompt = promptSync({ sigint: true }); // criar uma instância do prompt-sync para entrada de dados

// SEÇÃO CLIENTE
const nome: string = prompt("Digite o nome do cliente: ");
const email: string = prompt("Digite o email do cliente: ");

const createClientes: Cliente = {
  id: Math.floor(Math.random() * 1000), // gera um id sequencial para o cliente
  nome: nome,
  email: email,
};

createCliente(createClientes); // cadastrar o cliente

const readClientes: Cliente[] = readCliente();

console.log("Clientes cadastrados:");
readClientes.forEach((cliente) => {
  console.log(cliente);
});

// SEÇÃO PRODUTO

const nomeProduto: string = prompt("Digite o nome do produto: ");
const categoriaProduto: string = prompt("Digite a categoria do produto: ");
const precoProduto: number = parseFloat(prompt("Digite o preço do produto: "));
const estoqueProduto: number = parseInt(
  prompt("Digite a quantidade em estoque do produto: "),
);

const createProdutos: Produto = {
  id: Math.floor(Math.random() * 1000), // gera um id sequencial para o produto
  nome: nomeProduto,
  categoria: categoriaProduto,
  preco: precoProduto,
  estoque: estoqueProduto,
};

createProduto(createProdutos); // cadastrar o produto

const readProdutos: Produto[] = readProduto();

console.log("Produtos cadastrados:");
readProdutos.forEach((produto) => {
  console.log(produto);
});
