import type { Cliente } from "./types";

const clientes: Cliente[] = [];

// cadastrar cliente
function createCliente(cliente: Cliente): boolean {
  if (cliente.nome === "" || cliente.email === "") {
    console.log("Erro: Nome e email do cliente são obrigatórios.");
    return false;
  }
  clientes.push(cliente);
  console.log("Cadastro de cliente realizado com sucesso!");
  return true;
}

// listar clientes
function readCliente(): Cliente[] {
  return clientes;
}

export { createCliente, readCliente };
