import { readPedidos } from "./pedidos";
import { readProdutos } from "./produtos";
import { readClientePorId } from "./clientes";
import { formatarMoeda, formatarData } from "./utils";

const SEPARADOR_RELATORIO = "=".repeat(64);
const LINHA_SUBTOTAL_RELATORIO = "-".repeat(64);

function readRelatorioVendasGerais(): void {
  const pedidos = readPedidos();

  console.log(`\n${SEPARADOR_RELATORIO}`);
  console.log(
    "                   RELATÓRIO GERAL DE VENDAS                    ",
  );
  console.log(SEPARADOR_RELATORIO);

  if (pedidos.length === 0) {
    console.log("NENHUMA VENDA REALIZADA ATÉ O MOMENTO.");
    console.log(`${SEPARADOR_RELATORIO}\n`);
    return;
  }

  const totalPedidos = pedidos.length;

  const faturamentoTotal = pedidos.reduce((acumulador, pedido) => {
    return acumulador + pedido.total;
  }, 0);

  const totalUnidadesVendidas = pedidos.reduce((accTotal, pedido) => {
    return (
      accTotal +
      pedido.itens.reduce((accItem, item) => accItem + item.quantidade, 0)
    );
  }, 0);

  const ticketMedio = faturamentoTotal / totalPedidos;

  console.log(`TOTAL DE PEDIDOS REALIZADOS : ${totalPedidos}`);
  console.log(`UNIDADES DE ITENS VENDIDAS  : ${totalUnidadesVendidas}`);
  console.log(
    `FATURAMENTO BRUTO TOTAL     : ${formatarMoeda(faturamentoTotal)}`,
  );
  console.log(`TICKET MÉDIO POR PEDIDO     : ${formatarMoeda(ticketMedio)}`);
  console.log(`${SEPARADOR_RELATORIO}\n`);
}

function readRelatorioProdutosMaisVendidos(): void {
  const pedidos = readPedidos();

  console.log(`\n${SEPARADOR_RELATORIO}`);
  console.log(
    "               RELATÓRIO: PRODUTOS MAIS VENDIDOS                ",
  );
  console.log(SEPARADOR_RELATORIO);

  if (pedidos.length === 0) {
    console.log("NENHUMA VENDA REGISTRADA PARA APURAÇÃO.");
    console.log(`${SEPARADOR_RELATORIO}\n`);
    return;
  }

  const consolidado: Record<
    number,
    { nome: string; quantidade: number; receita: number }
  > = {};

  pedidos.forEach((pedido) => {
    pedido.itens.forEach((item) => {
      const registro = consolidado[item.idProduto];
      if (registro) {
        registro.quantidade += item.quantidade;
        registro.receita += item.subtotal;
      } else {
        consolidado[item.idProduto] = {
          nome: item.nome,
          quantidade: item.quantidade,
          receita: item.subtotal,
        };
      }
    });
  });

  const ranking = Object.values(consolidado).sort(
    (a, b) => b.quantidade - a.quantidade,
  );

  ranking.forEach((prod, index) => {
    console.log(
      `${index + 1}º | ${prod.nome.toUpperCase().padEnd(28)} | QTD VENDIDA: ${String(prod.quantidade).padStart(3)} UN | RECEITA: ${formatarMoeda(prod.receita)}`,
    );
  });

  console.log(`${SEPARADOR_RELATORIO}\n`);
}

function readRelatorioEstoqueBaixo(limiteAlerta: number = 5): void {
  const produtos = readProdutos();
  const produtosCriticos = produtos.filter((p) => p.estoque <= limiteAlerta);

  const tituloEstoque = `RELATÓRIO DE ESTOQUE BAIXO (ESTOQUE <= ${limiteAlerta} UN)`;
  const espacoTotal = 64 - tituloEstoque.length;
  const espacoEsquerda = Math.max(0, Math.floor(espacoTotal / 2));
  const tituloCentralizado = " ".repeat(espacoEsquerda) + tituloEstoque;

  console.log(`\n${SEPARADOR_RELATORIO}`);
  console.log(tituloCentralizado.padEnd(64));
  console.log(SEPARADOR_RELATORIO);

  if (produtosCriticos.length === 0) {
    console.log("NENHUM PRODUTO EM NÍVEL CRÍTICO DE ESTOQUE.");
    console.log(`${SEPARADOR_RELATORIO}\n`);
    return;
  }

  produtosCriticos.forEach((produto) => {
    const status =
      produto.estoque === 0
        ? "ESGOTADO"
        : `CRÍTICO (${produto.estoque} UN RESTANDO)`;
    console.log(
      `ID ${String(produto.id).padStart(2)} | ${produto.nome.toUpperCase().padEnd(28)} | CATEGORIA: ${produto.categoria.toUpperCase().padEnd(12)} | STATUS: ${status}`,
    );
  });

  console.log(`${SEPARADOR_RELATORIO}\n`);
}

function readRelatorioPedidosCliente(idCliente: number): void {
  const cliente = readClientePorId(idCliente);

  if (!cliente) {
    console.log(`\nERRO: CLIENTE ID ${idCliente} NÃO ENCONTRADO.\n`);
    return;
  }

  const pedidos = readPedidos().filter((p) => p.idCliente === idCliente);

  console.log(`\n${SEPARADOR_RELATORIO}`);
  console.log(`   HISTÓRICO DE PEDIDOS: ${cliente.nome.toUpperCase()}`);
  console.log(`   E-MAIL: ${cliente.email.toUpperCase()}`);
  console.log(SEPARADOR_RELATORIO);

  if (pedidos.length === 0) {
    console.log("O CLIENTE AINDA NÃO POSSUI COMPRAS REGISTRADAS.");
    console.log(`${SEPARADOR_RELATORIO}\n`);
    return;
  }

  let totalGastoCliente = 0;

  pedidos.forEach((pedido) => {
    totalGastoCliente += pedido.total;
    console.log(
      `\nPEDIDO #${pedido.id} - DATA: ${formatarData(pedido.data)} - TOTAL: ${formatarMoeda(pedido.total)}`,
    );
    console.log("ITENS:");
    pedido.itens.forEach((it) => {
      console.log(
        `  - [ID PRODUTO ${it.idProduto}] ${it.nome.toUpperCase()} | ${it.quantidade}X ${formatarMoeda(it.precoUnitario)} = ${formatarMoeda(it.subtotal)}`,
      );
    });
  });

  console.log(LINHA_SUBTOTAL_RELATORIO);
  console.log(
    `TOTAL ACUMULADO EM COMPRAS: ${formatarMoeda(totalGastoCliente)}`,
  );
  console.log(`${SEPARADOR_RELATORIO}\n`);
}

export {
  readRelatorioVendasGerais,
  readRelatorioProdutosMaisVendidos,
  readRelatorioEstoqueBaixo,
  readRelatorioPedidosCliente,
};
