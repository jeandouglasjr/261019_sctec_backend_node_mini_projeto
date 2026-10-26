const prompt = promptSync({ sigint: true }); // criar uma instância do prompt-sync para entrada de dados
import type { Cliente } from "./types";
import { validaNome } from "./utils";

const clientes: Cliente[] = [];

// cadastrar cliente
let idCliente: Number = 0;

function createCliente(): void {
  const nome: string = prompt("Digite o nome do cliente: ");
  const email: string = prompt("Digite o email do cliente: ");
  const novoCliente: Cliente = {
    id: idCliente++,
    nome: nome,
    email: email,
  };
  adicionaACliente(novoCliente); // cadastrar o cliente
}

function adicionaACliente(cliente: Cliente): boolean {
  if (!validaNome(cliente.nome) || !validaNome(cliente.email)) {
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
