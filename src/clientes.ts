import type { Cliente } from "./types";

const clientes: Cliente[] = [];

// cadastrar cliente
function createCliente(cliente: Cliente): void {
  clientes.push(cliente);
}

// listar clientes
function readCliente(): Cliente[] {
  return clientes;
}

export { createCliente, readCliente };
