import type { Cliente } from "./types";

const cliente: Cliente[] = [];

function cadastrarCliente(clientes: Cliente): void {
  cliente.push(clientes);
}

function exibirClientes(): Cliente[] {
  return cliente;
}

const novoCliente1: Cliente = {
  id: 1,
  nome: "João Silva",
  email: "joao.silva@example.com",
};

cadastrarCliente(novoCliente1);

const novoCliente2: Cliente = {
  id: 2,
  nome: "Maria Souza",
  email: "maria.souza@example.com",
};

cadastrarCliente(novoCliente2);

const novoCliente3: Cliente = {
  id: 3,
  nome: "Carlos Oliveira",
  email: "carlos.oliveira@example.com",
};

cadastrarCliente(novoCliente3);

export { cadastrarCliente, exibirClientes };
