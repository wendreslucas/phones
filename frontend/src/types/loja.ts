export interface Comissao {
  id: string
  vendedor: string
  tipo: 'percentual' | 'valor_fixo'
  valor: number
  metaMinima: number
  periodo: string
  status: 'ativo' | 'inativo'
  criadoEm: string
}

export interface Desconto {
  id: string
  nome: string
  tipo: 'percentual' | 'valor_fixo'
  valor: number
  aplicacao: 'produto' | 'categoria' | 'geral'
  validoDe: string
  validoAte: string
  status: 'ativo' | 'inativo' | 'expirado'
  criadoEm: string
}

export interface MetaVenda {
  id: string
  vendedor: string
  periodo: string
  metaValor: number
  realizado: number
  percentual: number
  status: 'atingida' | 'em_andamento' | 'nao_atingida'
}
