import promptSync = require("prompt-sync"); // importar o prompt-sync para entrada de dados
import { createCliente, readCliente } from "./clientes"; // importar as funções de cadastro e leitura de clientes
import { createProduto, readProduto } from "./produtos"; // importar as funções de cadastro e leitura de produtos
import type { Cliente, Produto } from "./types"; // importar o tipo cliente

// SEÇÃO CLIENTE
let opcao: number = 9;

do {
  console.log("1 - Cadastrar cliente");
  console.log("2 - Listar clientes");
  console.log("3 - Cadastrar Produto");
  console.log("4 - Listar Produtos");
  console.log("5 - Inserir no Carrinho");
  console.log("6 - Ver Carrinho");
  console.log("7 - Ver Pedidos");
  console.log("0 - Sair");

  let opcao = Number(prompt("Escolha uma opção: "));
  switch (opcao) {
    case 1:
      createCliente();
      break;
    case 2:
      console.log(readCliente());
      break;
    case 3:
      createProduto();
      break;
    case 4:
      console.log(readProduto());
      });
      break;
      case 5:
      // Lógica para inserir no carrinho
      break;
    case 6:
      // Lógica para ver carrinho
      break;
    case 0:
      console.log("SAIR");
      break;
} while (opcao !== 0);
{
}

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
