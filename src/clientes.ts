import type { Cliente, RespostaOperacao } from "./types";
import { validaNome, validaEmail } from "./utils";

// 3 cadastros iniciais de clientes
const clientes: Cliente[] = [
  { id: 1, nome: "Carlos Eduardo Silva", email: "carlos.silva@email.com" },
  { id: 2, nome: "Ana Beatriz Souza", email: "ana.souza@email.com" },
  { id: 3, nome: "Bruno Henrique Oliveira", email: "bruno.oliveira@email.com" },
];

// contador para geração sequencial de ids únicos
let proximoIdCliente: number = 4;

// cadastrar cliente
function createCliente(
  nome: string,
  email: string,
  id?: number,
): RespostaOperacao<Cliente> {
  // Validação: Nome informado e não vazio
  if (!validaNome(nome)) {
    return {
      sucesso: false,
      mensagem: "Erro: O nome do cliente é obrigatório.",
    };
  }

  // email obrigatório
  if (!validaEmail(email)) {
    return {
      sucesso: false,
      mensagem: "Erro: email inválido ou não informado.",
    };
  }

  const emailFormatado = email.trim().toLowerCase();

  // email único
  const emailJaExiste = clientes.some(
    (c) => c.email.toLowerCase() === emailFormatado,
  );
  if (emailJaExiste) {
    return {
      sucesso: false,
      mensagem: `Erro: O e-mail "${email.trim()}" já está cadastrado.`,
    };
  }

  // id único
  let idFinal: number;
  if (id !== undefined) {
    const idJaExiste = clientes.some((c) => c.id === id);
    if (idJaExiste) {
      return {
        sucesso: false,
        mensagem: `Erro: Já existe um cliente com esse id.`,
      };
    }
    idFinal = id;
    if (id >= proximoIdCliente) {
      proximoIdCliente = id + 1;
    }
  } else {
    idFinal = proximoIdCliente++;
  }

  const novoCliente: Cliente = {
    id: idFinal,
    nome: nome.trim(),
    email: emailFormatado,
  };

  clientes.push(novoCliente);

  return {
    sucesso: true,
    mensagem: `Cliente "${novoCliente.nome}" cadastrado com sucesso (ID: ${novoCliente.id}).`,
    dados: novoCliente,
  };
}

// listar clientes
function readClientes(): Cliente[] {
  return [...clientes];
}

// listar cliente por id
function readClientePorId(id: number): Cliente | undefined {
  return clientes.find((cliente) => cliente.id === id);
}

// listar cliente por email
function readClientePorEmail(email: string): Cliente | undefined {
  const emailFormatado = email.trim().toLowerCase();
  return clientes.find(
    (cliente) => cliente.email.toLowerCase() === emailFormatado,
  );
}

export { createCliente, readClientes, readClientePorId, readClientePorEmail };
