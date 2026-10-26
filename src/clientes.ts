import type { Cliente } from "./types";

const clientes: Cliente[] = [];

// cadastrar cliente
function createCliente(cliente: Cliente): void {
  if (!cliente.nome || !cliente.email) {
    throw new Error("Nome e email são obrigatórios para cadastrar um cliente.");
  }
  clientes.push(cliente);
}

// listar clientes
function readCliente(): Cliente[] {
  return clientes;
}

export { createCliente, readCliente };
