const prompt = promptSync({ sigint: true }); // criar uma instância do prompt-sync para entrada de dados
import type { Produto } from "./types";
import { validaNome } from "./utils";

const produtos: Produto[] = [];

// cadastrar produto
let idProduto: Number = 0;

function createProduto(): void {
  const nome: string = prompt("Digite o nome do produto: ");
  const categoria: string = prompt("Digite a categoria do produto: ");
  const preco: number = parseFloat(prompt("Digite o preço do produto: "));
  const estoque: number = parseInt(
    prompt("Digite a quantidade em estoque do produto: "),
  );
  const novoProduto: Produto = {
    id: idProduto++,
    nome: nome,
    categoria: categoria,
    preco: preco,
    estoque: estoque,
  };
  createProduto(novoProduto);
}

function createProduto(produto: Produto): boolean {
  if (!validaNome(produto.nome) || !validaNome(produto.categoria)) {
    console.log("Erro: Nome e/ou Categoria do produto são obrigatórios.");
    return false;
  } else if (produto.preco < 0) {
    console.log("Erro: Preço deve ser maior que zero.");
    return false;
  } else if (produto.estoque < 0) {
    console.log("Erro: Estoque deve ser maior que zero.");
    return false;
  } else {
    produtos.push(produto);
    console.log("Cadastro de produto realizado com sucesso!");
    return true;
  }
}

// listar produtos
function readProduto(): Produto[] {
  return produtos;
}

export { createProduto, readProduto };

  console.log("Cadastro de cliente realizado com sucesso!");
  return true;
}

// listar produtos
function readProduto(): Produto[] {
  return produtos;
}

export { createProduto, readProduto };
