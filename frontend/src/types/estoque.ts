export interface MovimentacaoEstoque {
  id: string
  tipo: 'entrada' | 'saida' | 'transferencia'
  produto: string
  quantidade: number
  motivo: string
  responsavel: string
  data: string
  observacao: string
}

export interface NfeFornecedor {
  id: string
  numero: string
  serie: string
  fornecedor: string
  cnpjFornecedor: string
  dataEmissao: string
  dataEntrada: string
  valorTotal: number
  itens: number
  status: 'pendente' | 'processada' | 'cancelada'
}

export interface PosicaoSintetica {
  id: string
  produto: string
  categoria: string
  quantidadeAtual: number
  quantidadeMinima: number
  quantidadeMaxima: number
  ultimaMovimentacao: string
  status: 'normal' | 'baixo' | 'critico' | 'excesso'
}

export interface EstoqueValorizado {
  id: string
  produto: string
  categoria: string
  quantidade: number
  custoUnitario: number
  custoTotal: number
  precoVenda: number
  margemLucro: number
  valorTotalEstoque: number
}
