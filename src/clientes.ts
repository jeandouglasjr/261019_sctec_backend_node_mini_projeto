import type { Cliente } from "./types";

const clientes: Cliente[] = [];

// cadastrar cliente
function createCliente(cliente: Cliente): boolean {
  if (cliente.nome === "" || cliente.email === "") {
    return false;
  }
  clientes.push(cliente);
  return true;
}

// listar clientes
function readCliente(): Cliente[] {
  return clientes;
}

export { createCliente, readCliente };
