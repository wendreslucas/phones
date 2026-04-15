import type { Comissao, Desconto, MetaVenda } from '@/types/loja'
import type { IMEI, Cartao, GrupoPermissao, GrupoContas, Fornecedor } from '@/types/cadastro'
import type { MovimentacaoEstoque, NfeFornecedor, PosicaoSintetica, EstoqueValorizado } from '@/types/estoque'

export const comissoes: Comissao[] = [
  { id: '1', vendedor: 'Carlos Silva', tipo: 'percentual', valor: 5, metaMinima: 10000, periodo: '2025-01', status: 'ativo', criadoEm: '2025-01-05' },
  { id: '2', vendedor: 'Ana Oliveira', tipo: 'percentual', valor: 7, metaMinima: 15000, periodo: '2025-01', status: 'ativo', criadoEm: '2025-01-05' },
  { id: '3', vendedor: 'Pedro Santos', tipo: 'valor_fixo', valor: 500, metaMinima: 8000, periodo: '2025-01', status: 'inativo', criadoEm: '2025-01-03' },
  { id: '4', vendedor: 'Maria Costa', tipo: 'percentual', valor: 6, metaMinima: 12000, periodo: '2025-02', status: 'ativo', criadoEm: '2025-02-01' },
  { id: '5', vendedor: 'Lucas Ferreira', tipo: 'valor_fixo', valor: 750, metaMinima: 20000, periodo: '2025-02', status: 'ativo', criadoEm: '2025-02-01' },
]

export const descontos: Desconto[] = [
  { id: '1', nome: 'Promo Verao', tipo: 'percentual', valor: 15, aplicacao: 'categoria', validoDe: '2025-01-01', validoAte: '2025-03-31', status: 'ativo', criadoEm: '2024-12-20' },
  { id: '2', nome: 'Desconto Funcionario', tipo: 'percentual', valor: 10, aplicacao: 'geral', validoDe: '2025-01-01', validoAte: '2025-12-31', status: 'ativo', criadoEm: '2024-12-15' },
  { id: '3', nome: 'Black Friday', tipo: 'percentual', valor: 30, aplicacao: 'geral', validoDe: '2024-11-25', validoAte: '2024-11-30', status: 'expirado', criadoEm: '2024-11-01' },
  { id: '4', nome: 'Fidelidade Gold', tipo: 'valor_fixo', valor: 200, aplicacao: 'produto', validoDe: '2025-01-01', validoAte: '2025-06-30', status: 'ativo', criadoEm: '2024-12-28' },
  { id: '5', nome: 'Lancamento Galaxy', tipo: 'percentual', valor: 5, aplicacao: 'produto', validoDe: '2025-02-01', validoAte: '2025-02-28', status: 'inativo', criadoEm: '2025-01-25' },
]

export const metasVenda: MetaVenda[] = [
  { id: '1', vendedor: 'Carlos Silva', periodo: 'Jan/2025', metaValor: 50000, realizado: 47500, percentual: 95, status: 'em_andamento' },
  { id: '2', vendedor: 'Ana Oliveira', periodo: 'Jan/2025', metaValor: 60000, realizado: 63000, percentual: 105, status: 'atingida' },
  { id: '3', vendedor: 'Pedro Santos', periodo: 'Jan/2025', metaValor: 40000, realizado: 28000, percentual: 70, status: 'nao_atingida' },
  { id: '4', vendedor: 'Maria Costa', periodo: 'Jan/2025', metaValor: 55000, realizado: 55800, percentual: 101.5, status: 'atingida' },
  { id: '5', vendedor: 'Lucas Ferreira', periodo: 'Fev/2025', metaValor: 70000, realizado: 35000, percentual: 50, status: 'em_andamento' },
  { id: '6', vendedor: 'Carlos Silva', periodo: 'Fev/2025', metaValor: 52000, realizado: 48000, percentual: 92.3, status: 'em_andamento' },
]

export const imeis: IMEI[] = [
  { id: '1', numero: '353456789012345', produto: 'iPhone 15 Pro', modelo: 'A2848', status: 'disponivel', fornecedor: 'Apple Brasil', dataEntrada: '2025-01-10', nfe: '001234' },
  { id: '2', numero: '353456789012346', produto: 'iPhone 15 Pro', modelo: 'A2848', status: 'vendido', fornecedor: 'Apple Brasil', dataEntrada: '2025-01-10', nfe: '001234' },
  { id: '3', numero: '358765432109876', produto: 'Galaxy S24 Ultra', modelo: 'SM-S928B', status: 'disponivel', fornecedor: 'Samsung Dist.', dataEntrada: '2025-01-15', nfe: '005678' },
  { id: '4', numero: '358765432109877', produto: 'Galaxy S24 Ultra', modelo: 'SM-S928B', status: 'reservado', fornecedor: 'Samsung Dist.', dataEntrada: '2025-01-15', nfe: '005678' },
  { id: '5', numero: '861234567890123', produto: 'Xiaomi 14', modelo: 'MZB0G6VIN', status: 'defeito', fornecedor: 'Xiaomi Oficial', dataEntrada: '2025-01-20', nfe: '009012' },
  { id: '6', numero: '861234567890124', produto: 'Motorola Edge 50', modelo: 'XT2301-4', status: 'disponivel', fornecedor: 'Motorola BR', dataEntrada: '2025-02-01', nfe: '009456' },
]

export const cartoes: Cartao[] = [
  { id: '1', bandeira: 'Visa', tipo: 'credito', taxaPercentual: 2.49, diasRecebimento: 30, status: 'ativo' },
  { id: '2', bandeira: 'Visa', tipo: 'debito', taxaPercentual: 1.39, diasRecebimento: 1, status: 'ativo' },
  { id: '3', bandeira: 'Mastercard', tipo: 'credito', taxaPercentual: 2.69, diasRecebimento: 30, status: 'ativo' },
  { id: '4', bandeira: 'Mastercard', tipo: 'debito', taxaPercentual: 1.49, diasRecebimento: 1, status: 'ativo' },
  { id: '5', bandeira: 'Elo', tipo: 'credito', taxaPercentual: 3.19, diasRecebimento: 30, status: 'ativo' },
  { id: '6', bandeira: 'Alelo', tipo: 'voucher', taxaPercentual: 4.50, diasRecebimento: 30, status: 'inativo' },
]

export const gruposPermissao: GrupoPermissao[] = [
  { id: '1', nome: 'Administrador', descricao: 'Acesso total ao sistema', permissoes: ['loja', 'cadastro', 'estoque', 'financeiro', 'relatorios', 'configuracoes'], usuarios: 2, criadoEm: '2024-06-01' },
  { id: '2', nome: 'Gerente', descricao: 'Gestao de loja e equipe', permissoes: ['loja', 'cadastro', 'estoque', 'relatorios'], usuarios: 3, criadoEm: '2024-06-01' },
  { id: '3', nome: 'Vendedor', descricao: 'Operacoes de venda', permissoes: ['loja', 'cadastro'], usuarios: 8, criadoEm: '2024-06-15' },
  { id: '4', nome: 'Estoquista', descricao: 'Controle de estoque', permissoes: ['estoque', 'cadastro'], usuarios: 4, criadoEm: '2024-07-01' },
  { id: '5', nome: 'Financeiro', descricao: 'Gestao financeira', permissoes: ['financeiro', 'relatorios'], usuarios: 2, criadoEm: '2024-08-01' },
]

export const gruposContas: GrupoContas[] = [
  { id: '1', nome: 'Vendas de Produtos', tipo: 'receita', descricao: 'Receita de venda de aparelhos e acessorios', contasVinculadas: 5, status: 'ativo' },
  { id: '2', nome: 'Servicos', tipo: 'receita', descricao: 'Receita de servicos prestados', contasVinculadas: 3, status: 'ativo' },
  { id: '3', nome: 'Custos Operacionais', tipo: 'despesa', descricao: 'Despesas com operacao da loja', contasVinculadas: 8, status: 'ativo' },
  { id: '4', nome: 'Folha de Pagamento', tipo: 'despesa', descricao: 'Salarios e encargos', contasVinculadas: 4, status: 'ativo' },
  { id: '5', nome: 'Marketing', tipo: 'despesa', descricao: 'Investimentos em publicidade', contasVinculadas: 3, status: 'inativo' },
]

export const fornecedores: Fornecedor[] = [
  { id: '1', razaoSocial: 'Apple Computacao Brasil Ltda', nomeFantasia: 'Apple Brasil', cnpj: '00.623.904/0001-73', email: 'contato@apple.com.br', telefone: '(11) 4003-8000', cidade: 'Sao Paulo', uf: 'SP', status: 'ativo', criadoEm: '2024-03-15' },
  { id: '2', razaoSocial: 'Samsung Eletronica da Amazonia Ltda', nomeFantasia: 'Samsung Dist.', cnpj: '00.280.273/0001-37', email: 'vendas@samsung.com.br', telefone: '(11) 4004-0000', cidade: 'Manaus', uf: 'AM', status: 'ativo', criadoEm: '2024-03-15' },
  { id: '3', razaoSocial: 'Xiaomi Tecnologia Brasil Ltda', nomeFantasia: 'Xiaomi Oficial', cnpj: '38.076.670/0001-80', email: 'comercial@xiaomi.com.br', telefone: '(11) 3003-5000', cidade: 'Sao Paulo', uf: 'SP', status: 'ativo', criadoEm: '2024-05-20' },
  { id: '4', razaoSocial: 'Motorola Mobilidade Comercio Ltda', nomeFantasia: 'Motorola BR', cnpj: '07.000.413/0001-90', email: 'vendas@motorola.com.br', telefone: '(19) 2116-4000', cidade: 'Jaguariuna', uf: 'SP', status: 'ativo', criadoEm: '2024-04-10' },
  { id: '5', razaoSocial: 'Distribuidora Tech Sul Ltda', nomeFantasia: 'TechSul', cnpj: '12.345.678/0001-90', email: 'compras@techsul.com.br', telefone: '(51) 3333-4444', cidade: 'Porto Alegre', uf: 'RS', status: 'inativo', criadoEm: '2024-02-01' },
]

export const movimentacoes: MovimentacaoEstoque[] = [
  { id: '1', tipo: 'entrada', produto: 'iPhone 15 Pro', quantidade: 20, motivo: 'Compra fornecedor', responsavel: 'Carlos Silva', data: '2025-01-10', observacao: 'NFe 001234' },
  { id: '2', tipo: 'saida', produto: 'Galaxy S24 Ultra', quantidade: 3, motivo: 'Venda', responsavel: 'Ana Oliveira', data: '2025-01-12', observacao: 'Pedido #4521' },
  { id: '3', tipo: 'entrada', produto: 'Galaxy S24 Ultra', quantidade: 15, motivo: 'Compra fornecedor', responsavel: 'Carlos Silva', data: '2025-01-15', observacao: 'NFe 005678' },
  { id: '4', tipo: 'saida', produto: 'iPhone 15 Pro', quantidade: 5, motivo: 'Venda', responsavel: 'Maria Costa', data: '2025-01-18', observacao: 'Pedido #4530' },
  { id: '5', tipo: 'transferencia', produto: 'Xiaomi 14', quantidade: 10, motivo: 'Transferencia filial', responsavel: 'Pedro Santos', data: '2025-01-20', observacao: 'Filial Centro' },
  { id: '6', tipo: 'saida', produto: 'Motorola Edge 50', quantidade: 2, motivo: 'Defeito/Devolucao', responsavel: 'Lucas Ferreira', data: '2025-02-01', observacao: 'RMA #789' },
]

export const nfesFornecedor: NfeFornecedor[] = [
  { id: '1', numero: '001234', serie: '1', fornecedor: 'Apple Brasil', cnpjFornecedor: '00.623.904/0001-73', dataEmissao: '2025-01-08', dataEntrada: '2025-01-10', valorTotal: 159800.00, itens: 20, status: 'processada' },
  { id: '2', numero: '005678', serie: '1', fornecedor: 'Samsung Dist.', cnpjFornecedor: '00.280.273/0001-37', dataEmissao: '2025-01-13', dataEntrada: '2025-01-15', valorTotal: 112500.00, itens: 15, status: 'processada' },
  { id: '3', numero: '009012', serie: '1', fornecedor: 'Xiaomi Oficial', cnpjFornecedor: '38.076.670/0001-80', dataEmissao: '2025-01-18', dataEntrada: '2025-01-20', valorTotal: 34900.00, itens: 10, status: 'processada' },
  { id: '4', numero: '009456', serie: '2', fornecedor: 'Motorola BR', cnpjFornecedor: '07.000.413/0001-90', dataEmissao: '2025-01-28', dataEntrada: '2025-02-01', valorTotal: 45600.00, itens: 12, status: 'pendente' },
  { id: '5', numero: '010100', serie: '1', fornecedor: 'Apple Brasil', cnpjFornecedor: '00.623.904/0001-73', dataEmissao: '2025-02-05', dataEntrada: '', valorTotal: 239700.00, itens: 30, status: 'pendente' },
]

export const posicoesSinteticas: PosicaoSintetica[] = [
  { id: '1', produto: 'iPhone 15 Pro', categoria: 'Smartphones Apple', quantidadeAtual: 15, quantidadeMinima: 5, quantidadeMaxima: 50, ultimaMovimentacao: '2025-01-18', status: 'normal' },
  { id: '2', produto: 'Galaxy S24 Ultra', categoria: 'Smartphones Samsung', quantidadeAtual: 12, quantidadeMinima: 5, quantidadeMaxima: 40, ultimaMovimentacao: '2025-01-15', status: 'normal' },
  { id: '3', produto: 'Xiaomi 14', categoria: 'Smartphones Xiaomi', quantidadeAtual: 3, quantidadeMinima: 5, quantidadeMaxima: 30, ultimaMovimentacao: '2025-01-20', status: 'baixo' },
  { id: '4', produto: 'Motorola Edge 50', categoria: 'Smartphones Motorola', quantidadeAtual: 1, quantidadeMinima: 5, quantidadeMaxima: 25, ultimaMovimentacao: '2025-02-01', status: 'critico' },
  { id: '5', produto: 'AirPods Pro 2', categoria: 'Acessorios Apple', quantidadeAtual: 45, quantidadeMinima: 10, quantidadeMaxima: 40, ultimaMovimentacao: '2025-01-22', status: 'excesso' },
  { id: '6', produto: 'Galaxy Buds3 Pro', categoria: 'Acessorios Samsung', quantidadeAtual: 18, quantidadeMinima: 5, quantidadeMaxima: 30, ultimaMovimentacao: '2025-01-25', status: 'normal' },
]

export const estoqueValorizado: EstoqueValorizado[] = [
  { id: '1', produto: 'iPhone 15 Pro', categoria: 'Smartphones Apple', quantidade: 15, custoUnitario: 7990.00, custoTotal: 119850.00, precoVenda: 9999.00, margemLucro: 25.1, valorTotalEstoque: 149985.00 },
  { id: '2', produto: 'Galaxy S24 Ultra', categoria: 'Smartphones Samsung', quantidade: 12, custoUnitario: 7500.00, custoTotal: 90000.00, precoVenda: 9499.00, margemLucro: 26.7, valorTotalEstoque: 113988.00 },
  { id: '3', produto: 'Xiaomi 14', categoria: 'Smartphones Xiaomi', quantidade: 3, custoUnitario: 3490.00, custoTotal: 10470.00, precoVenda: 4599.00, margemLucro: 31.8, valorTotalEstoque: 13797.00 },
  { id: '4', produto: 'Motorola Edge 50', categoria: 'Smartphones Motorola', quantidade: 1, custoUnitario: 3800.00, custoTotal: 3800.00, precoVenda: 4799.00, margemLucro: 26.3, valorTotalEstoque: 4799.00 },
  { id: '5', produto: 'AirPods Pro 2', categoria: 'Acessorios Apple', quantidade: 45, custoUnitario: 1490.00, custoTotal: 67050.00, precoVenda: 2299.00, margemLucro: 54.3, valorTotalEstoque: 103455.00 },
  { id: '6', produto: 'Galaxy Buds3 Pro', categoria: 'Acessorios Samsung', quantidade: 18, custoUnitario: 890.00, custoTotal: 16020.00, precoVenda: 1399.00, margemLucro: 57.2, valorTotalEstoque: 25182.00 },
]
