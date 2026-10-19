import promptSync = require("prompt-sync");
import { cadastrarCliente, exibirClientes } from "./clientes";
import type { Cliente } from "./types";

const prompt = promptSync({ sigint: true });

const nomeInput: string = prompt("Digite o nome do cliente: ");
const emailInput: string = prompt("Digite o email do cliente: ");

const novoCliente: Cliente = {
  id: Math.floor(Math.random() * 1000), // gera um id sequencial para o cliente
  nome: nomeInput,
  email: emailInput,
};

cadastrarCliente(novoCliente);

const clientesCadastrados: Cliente[] = exibirClientes();

console.log("Clientes cadastrados:");
clientesCadastrados.forEach((cliente) => {
  console.log(
    `ID: ${cliente.id}, Nome: ${cliente.nome}, Email: ${cliente.email}`,
  );
});
