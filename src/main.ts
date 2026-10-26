import promptSync = require("prompt-sync");
import {
  createProduto,
  readProdutos,
  readProdutoPorId,
  readProdutosPorNome,
  readProdutosPorCategoria,
  updateProduto,
  deleteProduto,
} from "./produtos";
import { createCliente, readClientes, readClientePorId } from "./clientes";
import {
  createItemCarrinho,
  readItensCarrinho,
  readTotalCarrinho,
  updateItemCarrinho,
  deleteItemCarrinho,
  deleteCarrinho,
} from "./carrinho";
import { createPedido, readPedidos, readPedidosPorCliente } from "./pedidos";
import {
  readRelatorioVendasGerais,
  readRelatorioProdutosMaisVendidos,
  readRelatorioEstoqueBaixo,
  readRelatorioPedidosCliente,
} from "./relatorios";
import { formatarMoeda, formatarData } from "./utils";

const prompt = promptSync({ sigint: true });

function executarDemonstracaoCompleta(): void {
  console.log("\n================================================================");
  console.log("                DEMONSTRAÇÃO DO ECOMMERCE SCTEC                 ");
  console.log("================================================================\n");

  // 1. consulta inicial do catálogo e clientes
  console.log("--- 1. LISTAR CLIENTES E PRODUTOS ---");
  console.log("3 CLIENTES PRÉ-CADASTRADOS:");
  readClientes().forEach((c) =>
    console.log(`  [ID ${c.id}] ${c.nome.toUpperCase()} - E-MAIL: ${c.email.toUpperCase()}`),
  );

  console.log("\nPRODUTOS EM ESTOQUE:");
  readProdutos().forEach((p) =>
    console.log(
      `  [ID ${p.id}] ${p.nome.toUpperCase().padEnd(25)} | CAT: ${p.categoria.toUpperCase().padEnd(12)} | ${formatarMoeda(p.preco)} | ESTOQUE: ${p.estoque} UN`,
    ),
  );

  // 2. Cadastro de novos registros (CREATE)
  console.log("\n--- 2. CADASTRAR CLIENTE E PRODUTO ---");
  const novoProduto = createProduto(
    "WEBCAM FULL HD 1080P",
    "PERIFÉRICOS",
    199.9,
    12,
  );
  console.log(`> ${novoProduto.mensagem.toUpperCase()}`);

  const novoCliente = createCliente(
    "MARIANA COSTA RIBEIRO",
    "mariana.ribeiro@email.com",
  );
  console.log(`> ${novoCliente.mensagem.toUpperCase()}`);

  // 3. testes 3 situações inválidas
  console.log("\n--- 3. TESTES DE SITUAÇÕES INVÁLIDAS ---");

  // a: preço negativo
  console.log("\n[TESTE 1] CADASTRAR PRODUTO COM PREÇO NEGATIVO:");
  const prodInvalido = createProduto(
    "CABO HDMI DEFEITUOSO",
    "ACESSÓRIOS",
    -35.0,
    10,
  );
  console.log(`RESULTADO: ${prodInvalido.mensagem.toUpperCase()}`);

  // b: quantidade superior ao estoque disponível
  console.log("\n[TESTE 2] ADICIONAR QUANTIDADE SUPERIOR AO ESTOQUE:");
  const monitor = readProdutoPorId(3);
  const estoqueMonitor = monitor ? monitor.estoque : 5;
  console.log(`ESTOQUE DO MONITOR (ID 3): ${estoqueMonitor} UNIDADES.`);
  const addExcesso = createItemCarrinho(3, estoqueMonitor + 10);
  console.log(`RESULTADO: ${addExcesso.mensagem.toUpperCase()}`);

  // c: finalizar compra sem itens
  console.log("\n[TESTE 3] FINALIZAR COMPRA COM CARRINHO VAZIO:");
  deleteCarrinho();
  const compraVazia = createPedido(1);
  console.log(`RESULTADO OBTIDO: ${compraVazia.mensagem.toUpperCase()}`);

  // 4. operações carrinho
  console.log("\n--- 4. OPERAÇÕES CARRINHO DE COMPRAS ---");
  // Adiciona 2 teclados (ID 1)
  console.log("> ADICIONANDO 2X TECLADO MECÂNICO (ID PRODUTO: 1)...");
  createItemCarrinho(1, 2);

  // Adiciona mais 1 teclado (deve somar para 3 unidades, sem duplicar linha)
  console.log("> ADICIONANDO NOVAMENTE 1X TECLADO MECÂNICO (ID PRODUTO: 1)...");
  createItemCarrinho(1, 1);

  // Adiciona 2 Mouse Gamer (ID 2)
  console.log("> ADICIONANDO 2X MOUSE GAMER (ID PRODUTO: 2)...");
  createItemCarrinho(2, 2);

  // Altera quantidade do mouse para 1
  console.log(
    "> ALTERANDO QUANTIDADE DO MOUSE GAMER (ID PRODUTO: 2) PARA 1 UNIDADE...",
  );
  updateItemCarrinho(2, 1);

  // 5. Exibição dos itens e cálculo dos valores da compra
  console.log("\n--- 5. CÁLCULO DOS VALORES DA COMPRA ---");
  const itens = readItensCarrinho();
  itens.forEach((it) => {
    console.log(
      `  - [ID PRODUTO ${it.produto.id}] ${it.produto.nome.toUpperCase()} | ${it.quantidade} UN X ${formatarMoeda(it.produto.preco)} = ${formatarMoeda(it.subtotal)}`,
    );
  });
  console.log(`TOTAL CARRINHO: ${formatarMoeda(readTotalCarrinho())}`);

  // 6. Finalização do pedido e atualização do estoque
  console.log("\n--- 6. FINALIZAÇÃO DO PEDIDO E ATUALIZAÇÃO DO ESTOQUE ---");
  const estoqueTecladoAntes = readProdutoPorId(1)?.estoque ?? 0;
  const estoqueMouseAntes = readProdutoPorId(2)?.estoque ?? 0;
  console.log(
    `ESTOQUE ANTES DA COMPRA -> TECLADO: ${estoqueTecladoAntes} UN | MOUSE: ${estoqueMouseAntes} UN`,
  );

  const resultadoPedido = createPedido(1);
  console.log(`> ${resultadoPedido.mensagem.toUpperCase()}`);

  const estoqueTecladoDepois = readProdutoPorId(1)?.estoque ?? 0;
  const estoqueMouseDepois = readProdutoPorId(2)?.estoque ?? 0;
  console.log(
    `ESTOQUE DEPOIS DA COMPRA -> TECLADO: ${estoqueTecladoDepois} UN | MOUSE: ${estoqueMouseDepois} UN`,
  );

  // 7. Teste de preservação histórica de preço
  console.log("\n--- 7. TESTE DE IMUTABILIDADE HISTÓRICA DO PREÇO ---");
  console.log(
    "ALTERANDO O PREÇO DO TECLADO MECÂNICO NO CATÁLOGO PARA R$ 400,00...",
  );
  updateProduto(1, { preco: 400.0 });
  const pedidoGravado = resultadoPedido.dados;
  if (pedidoGravado) {
    const itemHistorico = pedidoGravado.itens.find((i) => i.idProduto === 1);
    console.log(
      `PREÇO UNITÁRIO REGISTRADO NO PEDIDO #${pedidoGravado.id}: ${formatarMoeda(itemHistorico?.precoUnitario ?? 0)} (PRESERVADO!)`,
    );
    console.log(
      `NOVO PREÇO NO CATÁLOGO ATUAL: ${formatarMoeda(readProdutoPorId(1)?.preco ?? 0)}`,
    );
  }

  // 8. Apresentação dos relatórios
  console.log("\n--- 8. RELATÓRIOS DO SISTEMA ---");
  readRelatorioVendasGerais();
  readRelatorioProdutosMaisVendidos();
  readRelatorioEstoqueBaixo(5);
  readRelatorioPedidosCliente(1);

  console.log("================================================================");
  console.log("              DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!               ");
  console.log("================================================================\n");
}

function menuProdutos(): void {
  let opcao: number;
  do {
    console.log("\n================================================================");
    console.log("                       GERENCIAR PRODUTOS                       ");
    console.log("================================================================");
    console.log("1 - LISTAR PRODUTOS");
    console.log("2 - CADASTRAR PRODUTO");
    console.log("3 - BUSCAR PRODUTO POR ID");
    console.log("4 - BUSCAR PRODUTOS POR NOME");
    console.log("5 - FILTRAR PRODUTOS POR CATEGORIA");
    console.log("6 - ATUALIZAR PRODUTO");
    console.log("7 - REMOVER PRODUTO");
    console.log("0 - VOLTAR AO MENU PRINCIPAL");
    console.log("================================================================");

    opcao = Number(prompt("ESCOLHA UMA OPÇÃO: "));

    switch (opcao) {
      case 1: {
        const prods = readProdutos();
        console.log("\n--- LISTAGEM DE PRODUTOS ---");
        if (prods.length === 0) {
          console.log("NENHUM PRODUTO CADASTRADO.");
        } else {
          prods.forEach((p) => {
            console.log(
              `[ID ${p.id}] ${p.nome.toUpperCase().padEnd(25)} | CAT: ${p.categoria.toUpperCase().padEnd(12)} | PREÇO: ${formatarMoeda(p.preco)} | ESTOQUE: ${p.estoque} UN`,
            );
          });
        }
        break;
      }
      case 2: {
        console.log("\n--- CADASTRAR PRODUTO ---");
        const nome = prompt("NOME DO PRODUTO: ");
        const categoria = prompt("CATEGORIA: ");
        const preco = parseFloat(prompt("PREÇO UNITÁRIO (EX: 99.90): "));
        const estoque = parseInt(prompt("ESTOQUE: "), 10);

        const res = createProduto(nome, categoria, preco, estoque);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        break;
      }
      case 3: {
        const id = parseInt(prompt("DIGITE O ID DO PRODUTO: "), 10);
        const produto = readProdutoPorId(id);
        if (produto) {
          console.log("\nPRODUTO ENCONTRADO:");
          console.log(`ID       : ${produto.id}`);
          console.log(`NOME     : ${produto.nome.toUpperCase()}`);
          console.log(`CATEGORIA: ${produto.categoria.toUpperCase()}`);
          console.log(`PREÇO    : ${formatarMoeda(produto.preco)}`);
          console.log(`ESTOQUE  : ${produto.estoque} UNIDADES`);
        } else {
          console.log(`\nPRODUTO COM ID ${id} NÃO ENCONTRADO.`);
        }
        break;
      }
      case 4: {
        const termo = prompt("DIGITE O TERMO OU PARTE DO NOME: ");
        const encontrados = readProdutosPorNome(termo);
        console.log(`\n--- RESULTADOS PARA "${termo.toUpperCase()}" ---`);
        if (encontrados.length === 0) {
          console.log("NENHUM PRODUTO LOCALIZADO COM ESSE NOME.");
        } else {
          encontrados.forEach((p) => {
            console.log(
              `[ID ${p.id}] ${p.nome.toUpperCase()} - CAT: ${p.categoria.toUpperCase()} - ${formatarMoeda(p.preco)} (ESTOQUE: ${p.estoque})`,
            );
          });
        }
        break;
      }
      case 5: {
        const cat = prompt("DIGITE A CATEGORIA: ");
        const filtrados = readProdutosPorCategoria(cat);
        console.log(`\n--- PRODUTOS NA CATEGORIA "${cat.toUpperCase()}" ---`);
        if (filtrados.length === 0) {
          console.log("NENHUM PRODUTO ENCONTRADO NESTA CATEGORIA.");
        } else {
          filtrados.forEach((p) => {
            console.log(
              `[ID ${p.id}] ${p.nome.toUpperCase()} - ${formatarMoeda(p.preco)} (ESTOQUE: ${p.estoque})`,
            );
          });
        }
        break;
      }
      case 6: {
        const id = parseInt(prompt("DIGITE O ID DO PRODUTO A ATUALIZAR: "), 10);
        const produto = readProdutoPorId(id);
        if (!produto) {
          console.log(`\nPRODUTO COM ID ${id} NÃO ENCONTRADO.`);
          break;
        }

        console.log(
          `ATUALIZANDO "${produto.nome.toUpperCase()}". PRESSIONE ENTER PARA MANTER O VALOR ATUAL.`,
        );
        const novoNome = prompt(`NOVO NOME (${produto.nome.toUpperCase()}): `);
        const novaCat = prompt(`NOVA CATEGORIA (${produto.categoria.toUpperCase()}): `);
        const novoPrecoStr = prompt(`NOVO PREÇO (${produto.preco}): `);
        const novoEstoqueStr = prompt(`NOVO ESTOQUE (${produto.estoque}): `);

        const dados: {
          nome?: string;
          categoria?: string;
          preco?: number;
          estoque?: number;
        } = {};

        if (novoNome.trim() !== "") dados.nome = novoNome;
        if (novaCat.trim() !== "") dados.categoria = novaCat;
        if (novoPrecoStr.trim() !== "") dados.preco = parseFloat(novoPrecoStr);
        if (novoEstoqueStr.trim() !== "")
          dados.estoque = parseInt(novoEstoqueStr, 10);

        const res = updateProduto(id, dados);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        break;
      }
      case 7: {
        const id = parseInt(prompt("DIGITE O ID DO PRODUTO A REMOVER: "), 10);
        const res = deleteProduto(id);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        break;
      }
      case 0:
        console.log("RETORNANDO AO MENU PRINCIPAL...");
        break;
      default:
        console.log("OPÇÃO INVÁLIDA! ESCOLHA UM NÚMERO DO MENU.");
    }
  } while (opcao !== 0);
}

function menuClientes(): void {
  let opcao: number;
  do {
    console.log("\n================================================================");
    console.log("                       GERENCIAR CLIENTES                       ");
    console.log("================================================================");
    console.log("1 - LISTAR CLIENTES");
    console.log("2 - CADASTRAR CLIENTE");
    console.log("3 - BUSCAR CLIENTE");
    console.log("0 - VOLTAR AO MENU PRINCIPAL");
    console.log("================================================================");

    opcao = Number(prompt("ESCOLHA UMA OPÇÃO: "));

    switch (opcao) {
      case 1: {
        const lista = readClientes();
        console.log("\n--- LISTAGEM DE CLIENTES ---");
        if (lista.length === 0) {
          console.log("NENHUM CLIENTE CADASTRADO.");
        } else {
          lista.forEach((c) => {
            console.log(
              `[ID ${c.id}] ${c.nome.toUpperCase().padEnd(25)} | E-MAIL: ${c.email.toUpperCase()}`,
            );
          });
        }
        break;
      }
      case 2: {
        console.log("\n--- CADASTRAR CLIENTE ---");
        const nome = prompt("NOME COMPLETO: ");
        const email = prompt("E-MAIL: ");

        const res = createCliente(nome, email);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        break;
      }
      case 3: {
        const id = parseInt(prompt("DIGITE O ID DO CLIENTE: "), 10);
        const cliente = readClientePorId(id);
        if (cliente) {
          console.log("\nCLIENTE ENCONTRADO:");
          console.log(`ID    : ${cliente.id}`);
          console.log(`NOME  : ${cliente.nome.toUpperCase()}`);
          console.log(`E-MAIL: ${cliente.email.toUpperCase()}`);
        } else {
          console.log(`\nCLIENTE COM ID ${id} NÃO ENCONTRADO.`);
        }
        break;
      }
      case 0:
        console.log("RETORNANDO AO MENU PRINCIPAL...");
        break;
      default:
        console.log("OPÇÃO INVÁLIDA! ESCOLHA UM NÚMERO DO MENU.");
    }
  } while (opcao !== 0);
}

function menuCarrinho(): void {
  let opcao: number;
  do {
    console.log("\n================================================================");
    console.log("                      CARRINHO DE COMPRAS                       ");
    console.log("================================================================");
    console.log("1 - LISTAR ITENS");
    console.log("2 - INCLUIR PRODUTO NO CARRINHO");
    console.log("3 - ALTERAR QUANTIDADE DO ITEM");
    console.log("4 - REMOVER ITEM DO CARRINHO");
    console.log("5 - LIMPAR CARRINHO");
    console.log("0 - VOLTAR AO MENU PRINCIPAL");
    console.log("================================================================");

    opcao = Number(prompt("ESCOLHA UMA OPÇÃO: "));

    switch (opcao) {
      case 1: {
        const itens = readItensCarrinho();
        console.log("\n--- ITENS NO CARRINHO ---");
        if (itens.length === 0) {
          console.log("O CARRINHO ESTÁ VAZIO.");
        } else {
          itens.forEach((it) => {
            console.log(
              `[ID PRODUTO: ${it.produto.id}] ${it.produto.nome.toUpperCase().padEnd(25)} | ${it.quantidade} UN X ${formatarMoeda(it.produto.preco)} = SUBTOTAL: ${formatarMoeda(it.subtotal)}`,
            );
          });
          console.log("----------------------------------------------------------------");
          console.log(`VALOR TOTAL: ${formatarMoeda(readTotalCarrinho())}`);
        }
        break;
      }
      case 2: {
        console.log("\n--- ADICIONAR AO CARRINHO ---");
        const idProduto = parseInt(prompt("ID DO PRODUTO: "), 10);
        const qtd = parseInt(prompt("QUANTIDADE DESEJADA: "), 10);

        const res = createItemCarrinho(idProduto, qtd);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        break;
      }
      case 3: {
        const idProduto = parseInt(prompt("ID DO PRODUTO NO CARRINHO: "), 10);
        const novaQtd = parseInt(prompt("NOVA QUANTIDADE: "), 10);

        const res = updateItemCarrinho(idProduto, novaQtd);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        break;
      }
      case 4: {
        const idProduto = parseInt(
          prompt("ID DO PRODUTO A REMOVER DO CARRINHO: "),
          10,
        );
        const res = deleteItemCarrinho(idProduto);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        break;
      }
      case 5: {
        deleteCarrinho();
        console.log("\n> CARRINHO ESVAZIADO COM SUCESSO.");
        break;
      }
      case 0:
        console.log("RETORNANDO AO MENU PRINCIPAL...");
        break;
      default:
        console.log("OPÇÃO INVÁLIDA! ESCOLHA UM NÚMERO DO MENU.");
    }
  } while (opcao !== 0);
}

function menuPedidos(): void {
  let opcao: number;
  do {
    console.log("\n================================================================");
    console.log("                       GERENCIAR PEDIDOS                        ");
    console.log("================================================================");
    console.log("1 - FINALIZAR PEDIDO ATUAL DO CARRINHO (CREATE)");
    console.log("2 - LISTAR TODOS OS PEDIDOS (READ)");
    console.log("3 - CONSULTAR PEDIDOS POR ID DE CLIENTE (READ)");
    console.log("0 - VOLTAR AO MENU PRINCIPAL");
    console.log("================================================================");

    opcao = Number(prompt("ESCOLHA UMA OPÇÃO: "));

    switch (opcao) {
      case 1: {
        console.log("\n--- FINALIZAR PEDIDO ---");
        const idCliente = parseInt(prompt("INFORME O ID DO CLIENTE: "), 10);

        const res = createPedido(idCliente);
        console.log(`\n> ${res.mensagem.toUpperCase()}`);
        if (res.sucesso && res.dados) {
          console.log(`PEDIDO GRAVADO SOB O ID #${res.dados.id}.`);
        }
        break;
      }
      case 2: {
        const pedidos = readPedidos();
        console.log("\n--- LISTAGEM DE TODOS OS PEDIDOS ---");
        if (pedidos.length === 0) {
          console.log("NENHUM PEDIDO FINALIZADO NO SISTEMA.");
        } else {
          pedidos.forEach((p) => {
            console.log(
              `\nPEDIDO #${p.id} | CLIENTE ID: ${p.idCliente} | DATA: ${formatarData(p.data)} | TOTAL: ${formatarMoeda(p.total)}`,
            );
            console.log("ITENS COMPRADOS:");
            p.itens.forEach((it) => {
              console.log(
                `  - [ID PRODUTO ${it.idProduto}] ${it.nome.toUpperCase()} | ${it.quantidade}X ${formatarMoeda(it.precoUnitario)} = ${formatarMoeda(it.subtotal)}`,
              );
            });
          });
        }
        break;
      }
      case 3: {
        const idCliente = parseInt(prompt("INFORME O ID DO CLIENTE: "), 10);
        const pedidosCliente = readPedidosPorCliente(idCliente);
        console.log(`\n--- PEDIDOS DO CLIENTE ID ${idCliente} ---`);
        if (pedidosCliente.length === 0) {
          console.log("NENHUM PEDIDO ENCONTRADO PARA ESTE CLIENTE.");
        } else {
          pedidosCliente.forEach((p) => {
            console.log(
              `PEDIDO #${p.id} | DATA: ${formatarData(p.data)} | ITENS: ${p.itens.length} | TOTAL: ${formatarMoeda(p.total)}`,
            );
          });
        }
        break;
      }
      case 0:
        console.log("RETORNANDO AO MENU PRINCIPAL...");
        break;
      default:
        console.log("OPÇÃO INVÁLIDA! ESCOLHA UM NÚMERO DO MENU.");
    }
  } while (opcao !== 0);
}

function menuRelatorios(): void {
  let opcao: number;
  do {
    console.log("\n================================================================");
    console.log("                     RELATÓRIOS DO SISTEMA                      ");
    console.log("================================================================");
    console.log("1 - RELATÓRIO GERAL DE VENDAS (READ)");
    console.log("2 - RELATÓRIO DE PRODUTOS MAIS VENDIDOS (READ)");
    console.log("3 - RELATÓRIO DE ESTOQUE BAIXO (READ)");
    console.log("4 - RELATÓRIO DE COMPRAS POR CLIENTE (READ)");
    console.log("0 - VOLTAR AO MENU PRINCIPAL");
    console.log("================================================================");

    opcao = Number(prompt("ESCOLHA UMA OPÇÃO: "));

    switch (opcao) {
      case 1:
        readRelatorioVendasGerais();
        break;
      case 2:
        readRelatorioProdutosMaisVendidos();
        break;
      case 3: {
        const limiteStr = prompt("LIMITE DE ESTOQUE CRÍTICO (PADRÃO: 5): ");
        const limite = limiteStr.trim() !== "" ? parseInt(limiteStr, 10) : 5;
        readRelatorioEstoqueBaixo(limite);
        break;
      }
      case 4: {
        const idCliente = parseInt(prompt("ID DO CLIENTE: "), 10);
        readRelatorioPedidosCliente(idCliente);
        break;
      }
      case 0:
        console.log("RETORNANDO AO MENU PRINCIPAL...");
        break;
      default:
        console.log("OPÇÃO INVÁLIDA! ESCOLHA UM NÚMERO DO MENU.");
    }
  } while (opcao !== 0);
}

// ==========================================
// LOOP DO MENU PRINCIPAL (DO / WHILE)
// ==========================================

let opcaoPrincipal: number;

console.log("================================================================");
console.log("             SISTEMA DE GERENCIAMENTO DE E-COMMERCE             ");
console.log("          DESENVOLVEDOR BACK-END NODE [T6] - MÓDULO 1           ");
console.log("================================================================");

do {
  console.log("\n------------------------ MENU PRINCIPAL ------------------------");
  console.log("1 - GERENCIAR PRODUTOS");
  console.log("2 - GERENCIAR CLIENTES");
  console.log("3 - GERENCIAR CARRINHO DE COMPRAS");
  console.log("4 - GERENCIAR PEDIDOS");
  console.log("5 - RELATÓRIOS DO SISTEMA");
  console.log(
    "6 - EXECUTAR DEMONSTRAÇÃO AUTOMÁTICA E CASOS DE TESTE (PDF 3.4)",
  );
  console.log("0 - SAIR DO SISTEMA");
  console.log("----------------------------------------------------------------");

  opcaoPrincipal = Number(prompt("ESCOLHA UMA OPÇÃO: "));

  switch (opcaoPrincipal) {
    case 1:
      menuProdutos();
      break;
    case 2:
      menuClientes();
      break;
    case 3:
      menuCarrinho();
      break;
    case 4:
      menuPedidos();
      break;
    case 5:
      menuRelatorios();
      break;
    case 6:
      executarDemonstracaoCompleta();
      break;
    case 0:
      console.log("\nENCERRANDO O SISTEMA. ATÉ LOGO!\n");
      break;
    default:
      console.log("\nOPÇÃO INVÁLIDA! DIGITE UM NÚMERO DE 0 A 6.");
  }
} while (opcaoPrincipal !== 0);
