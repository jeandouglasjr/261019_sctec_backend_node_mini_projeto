import type { Cliente, RespostaOperacao } from "./types";
import { validaNome, validaEmail } from "./utils";

// 3 cadastros iniciais de clientes
const clientes: Cliente[] = [
  { id: 1, nome: "CARLOS EDUARDO SILVA", email: "carlos.silva@email.com" },
  { id: 2, nome: "ANA BEATRIZ SOUZA", email: "ana.souza@email.com" },
  { id: 3, nome: "BRUNO HENRIQUE OLIVEIRA", email: "bruno.oliveira@email.com" },
];

// contador para geração sequencial de ids únicos
let proximoIdCliente: number = 4;

// cadastrar cliente
function createCliente(
  nome: string,
  email: string,
  id?: number,
): RespostaOperacao<Cliente> {
  // nome obrigatório
  if (!validaNome(nome)) {
    return {
      sucesso: false,
      mensagem: "ERRO: O NOME DO CLIENTE É OBRIGATÓRIO.",
    };
  }

  // email obrigatório
  if (!validaEmail(email)) {
    return {
      sucesso: false,
      mensagem: "ERRO: EMAIL INVÁLIDO OU NÃO INFORMADO.",
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
      mensagem: `ERRO: O E-MAIL "${email.trim().toUpperCase()}" JÁ ESTÁ CADASTRADO.`,
    };
  }

  // id único
  let idFinal: number;
  if (id !== undefined) {
    const idJaExiste = clientes.some((c) => c.id === id);
    if (idJaExiste) {
      return {
        sucesso: false,
        mensagem: `ERRO: JÁ EXISTE UM CLIENTE COM ESSE ID.`,
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
    mensagem: `CLIENTE "${novoCliente.nome.toUpperCase()}" CADASTRADO COM SUCESSO (ID: ${novoCliente.id}).`,
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
