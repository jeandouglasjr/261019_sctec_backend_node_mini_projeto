import promptSync = require("prompt-sync"); // importar o prompt-sync para entrada de dados
import { createCliente, readCliente } from "./clientes"; // importar as funções de cadastro e leitura de clientes
import type { Cliente } from "./types"; // importar o tipo cliente

const prompt = promptSync({ sigint: true }); // criar uma instância do prompt-sync para entrada de dados

const nome: string = prompt("Digite o nome do cliente: ");
const email: string = prompt("Digite o email do cliente: ");

const createClientes: Cliente = {
  id: Math.floor(Math.random() * 1000), // gera um id sequencial para o cliente
  nome: nome,
  email: email,
};

createCliente(createClientes);

const readClientes: Cliente[] = readCliente();

console.log("Clientes cadastrados:");
readClientes.forEach((cliente) => {
  console.log(
    `ID: ${cliente.id}, Nome: ${cliente.nome}, Email: ${cliente.email}`,
  );
});
