# SCTEC - Desenvolvedor Back-End Node Turma 6 - Miniprojeto Ecommerce

# Jean Douglas Toledo Rodrigues Junior (jean_rodrigues-ju@estudante.sesisenai.org.br)

# Sistema de Gerenciamento de Ecommerce com TypeScript

## 1. Objetivo da Aplicação

O objetivo deste projeto é desenvolver o back-end de um **Sistema de Gerenciamento de E-commerce** utilizando **TypeScript** e **Node.js**, aplicando conceitos fundamentais de tipagem estática, modularização (`import`/`export`), manipulação de arrays e métodos de alta ordem (`find`, `filter`, `map`, `reduce`), validações condicionais rigorosas e consistência de regras de negócio.

A aplicação adota um padrão de nomenclatura baseado em operações **CRUD** (`create`, `read`, `update`, `delete`) para suas funções de negócio e uma convenção clara para chaves:

- **Chaves Primárias:** identificadas como `id`.
- **Chaves Estrangeiras:** identificadas com o prefixo da entidade relacionada, por exemplo `idProduto` e `idCliente`.

## 2. Tecnologias Utilizadas

- **Node.js** (Ambiente de execução JavaScript no servidor)
- **TypeScript** (Tipagem estática, interfaces e compilação rigorosa)
- **prompt-sync** e **@types/prompt-sync** (Interface interativa em linha de comando / CLI)

## 3. Estrutura dos Arquivos

```text
261023_sctec_miniprojeto/
├── src/
│   ├── types.ts          # Definições de interfaces (Produto, Cliente, ItemCarrinho, ItemPedido, Pedido)
│   ├── utils.ts          # Utilitários de validação (nome, e-mail) e formatação (moeda R$, datas)
│   ├── produtos.ts       # Módulo de Produtos com funções CRUD (create, read, update, delete)
│   ├── clientes.ts       # Módulo de Clientes com funções CRUD (inicia com 3 clientes)
│   ├── carrinho.ts       # Gestão do Carrinho (create, read, update, delete com chave idProduto)
│   ├── pedidos.ts        # Finalização de Pedidos (create, read com chaves idCliente e idProduto)
│   ├── relatorios.ts     # Funções de consolidação e relatórios (readRelatorio...)
│   └── main.ts           # Menus interativos CLI com estruturas do/while e demonstração completa
├── dist/                 # Código JavaScript compilado (gerado via npx tsc)
├── tsconfig.json         # Configurações do compilador TypeScript
├── package.json          # Metadados e dependências do projeto
└── Readme.md             # Documentação técnica completa da aplicação
```

## 4. Padrão de Nomenclatura CRUD e Funções Implementadas

### A. Produtos (`src/produtos.ts`)

- **[CREATE] `createProduto(nome, categoria, preco, estoque, id?)`:** cadastra um novo produto validando nome obrigatório, preço $> 0$, estoque $\ge 0$ e unicidade do `id`.
- **[READ] `readProdutos()`:** lista todos os produtos cadastrados.
- **[READ] `readProdutoPorId(id)`:** busca produto pelo identificador único (`id`).
- **[READ] `readProdutosPorNome(termo)`:** busca parcial case-insensitive por nome.
- **[READ] `readProdutosPorCategoria(categoria)`:** filtra produtos por categoria.
- **[UPDATE] `updateProduto(id, dados)`:** atualiza dados cadastrais de um produto.
- **[UPDATE] `updateReduzirEstoque(id, quantidade)`:** deduz estoque de forma segura na finalização de compras.
- **[DELETE] `deleteProduto(id)`:** remove um produto do catálogo.

### B. Clientes (`src/clientes.ts`)

- **[CREATE] `createCliente(nome, email, id?)`:** cadastra um cliente validando nome, e-mail válido, unicidade de `id` e unicidade de e-mail.
- **[READ] `readClientes()`:** lista todos os clientes (inicia com 3 clientes pré-cadastrados).
- **[READ] `readClientePorId(id)`:** busca cliente pelo identificador único (`id`).
- **[READ] `readClientePorEmail(email)`:** busca cliente por e-mail para evitar duplicidades.

### C. Carrinho de Compras (`src/carrinho.ts`)

- **[CREATE] `createItemCarrinho(idProduto, quantidade)`:** adiciona produto ao carrinho; se já existir, acumula a quantidade sem duplicar itens. Bloqueia quantidades negativas e superiores ao estoque.
- **[READ] `readCarrinho()`:** retorna os itens em formato bruto (`ItemCarrinho[]`).
- **[READ] `readItensCarrinho()`:** lista itens com detalhes completos do produto e cálculo de subtotais.
- **[READ] `readSubtotalItem(item)`:** calcula subtotal ($preço \times quantidade$).
- **[READ] `readTotalCarrinho()`:** calcula o valor total da compra somando subtotais via `reduce()`.
- **[UPDATE] `updateItemCarrinho(idProduto, novaQuantidade)`:** altera a quantidade de um item no carrinho.
- **[DELETE] `deleteItemCarrinho(idProduto)`:** remove um item do carrinho.
- **[DELETE] `deleteCarrinho()`:** esvazia todos os itens do carrinho.

### D. Pedidos (`src/pedidos.ts`)

- **[CREATE] `createPedido(idCliente)`:** finaliza a compra atômica para o cliente informado. Valida cliente existente, carrinho não vazio e estoque disponível de 100% dos itens antes de realizar qualquer dedução de estoque. Congela o preço histórico (`precoUnitario` e `subtotal`), gera um `id` único e esvazia o carrinho.
- **[READ] `readPedidos()`:** consulta todos os pedidos registrados.
- **[READ] `readPedidoPorId(id)`:** busca pedido pelo seu identificador único (`id`).
- **[READ] `readPedidosPorCliente(idCliente)`:** consulta os pedidos associados à chave estrangeira `idCliente`.

### E. Relatórios (`src/relatorios.ts`)

- **[READ] `readRelatorioVendasGerais()`:** total de pedidos, total de itens vendidos, faturamento bruto e ticket médio.
- **[READ] `readRelatorioProdutosMaisVendidos()`:** ranking dos produtos mais vendidos por quantidade e faturamento.
- **[READ] `readRelatorioEstoqueBaixo(limiteAlerta?)`:** lista produtos com estoque zerado ou em nível crítico.
- **[READ] `readRelatorioPedidosCliente(idCliente)`:** extrato consolidado de pedidos do cliente especificado.

### F. Interface em Linha de Comando (`src/main.ts`)

- Menus interativos organizados com laços `do { ... } while (opcao !== 0)` para o menu principal e submenus.
- Opção 6 de demonstração automatizada cobrindo o fluxo de ponta a ponta e os testes das 3 situações inválidas obrigatórias.

## 5. Regras de Negócio e Validações

1. **Unicidade de Identificadores:** chaves primárias `id` nunca se repetem.
2. **Unicidade de E-mail:** nenhum cliente pode se cadastrar com e-mail já existente.
3. **Validação de Valores:**
   - Nomes e categorias não podem estar vazios.
   - Preços devem ser maiores que zero.
   - Estoque não pode ser negativo.
   - Quantidades no carrinho devem ser maiores que zero.
4. **Reserva e Disponibilidade de Estoque:** impede adição ao carrinho de quantidades superiores ao estoque disponível.
5. **Atomicidade da Compra:** a finalização valida todos os itens antes de alterar qualquer estoque, evitando registros parciais em caso de falha.
6. **Imutabilidade Histórica de Preços:** o preço praticado no instante da compra é gravado no pedido, garantindo que remarcações futuras no catálogo não afetem compras passadas.

## 6. Instruções de Compilação e Execução

### 1. Instalação das dependências

```bash
npm install
```

### 2. Compilação TypeScript para JavaScript

```bash
npx tsc
```

### 3. Execução da Aplicação

```bash
node dist/main.js
```

## 7. Exemplos das Principais Operações

Ao executar `node dist/main.js`, o Menu Principal interativo com `do/while` é exibido:

```text
================================================================
             SISTEMA DE GERENCIAMENTO DE E-COMMERCE
================================================================

------------------------ MENU PRINCIPAL ------------------------
1 - GERENCIAR PRODUTOS
2 - GERENCIAR CLIENTES
3 - GERENCIAR CARRINHO DE COMPRAS
4 - GERENCIAR PEDIDOS
5 - RELATÓRIOS DO SISTEMA
6 - EXECUTAR DEMONSTRAÇÃO AUTOMÁTICA E CASOS DE TESTE
0 - SAIR DO SISTEMA
----------------------------------------------------------------
```

### Opção 6: Demonstração Automática e Casos de Teste

Executa a validação completa do sistema:

1. `readClientes()` e `readProdutos()` com os dados iniciais.
2. `createProduto()` e `createCliente()` cadastrando novos dados.
3. **Casos Inválidos Obrigatórios:**
   - Preço negativo $\rightarrow$ rejeitado por `createProduto`.
   - Quantidade acima do estoque $\rightarrow$ rejeitado por `createItemCarrinho`.
   - Compra com carrinho vazio $\rightarrow$ rejeitado por `createPedido`.
   - E-mail de cliente duplicado $\rightarrow$ rejeitado por `createCliente`.
4. Fluxo normal do carrinho: inserção, agrupamento e alteração de quantidade.
5. Finalização de pedido com baixa atômica de estoque e preservação do preço histórico.
6. Apresentação dos relatórios consolidados.

---

## 8. Limitações Conhecidas do Sistema

- **Armazenamento Volátil em Memória:** dados são mantidos em arrays durante o ciclo de execução do Node.js, sem persistência em disco ou banco de dados externo.
- **Ambiente de Terminal (CLI):** opera no terminal via `prompt-sync`, sem interface gráfica ou rotas HTTP Express.
- **Escopo Simplificado:** sem autenticação por senhas, gateways de pagamento real ou cálculo de frete.
