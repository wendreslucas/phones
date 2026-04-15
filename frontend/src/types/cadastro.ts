export interface IMEI {
  id: string
  numero: string
  produto: string
  modelo: string
  status: 'disponivel' | 'vendido' | 'reservado' | 'defeito'
  fornecedor: string
  dataEntrada: string
  nfe: string
}

export interface Cartao {
  id: string
  bandeira: string
  tipo: 'credito' | 'debito' | 'voucher'
  taxaPercentual: number
  diasRecebimento: number
  status: 'ativo' | 'inativo'
}

export interface GrupoPermissao {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
  usuarios: number
  criadoEm: string
}

export interface GrupoContas {
  id: string
  nome: string
  tipo: 'receita' | 'despesa'
  descricao: string
  contasVinculadas: number
  status: 'ativo' | 'inativo'
}

export interface Fornecedor {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  email: string
  telefone: string
  cidade: string
  uf: string
  status: 'ativo' | 'inativo'
  criadoEm: string
}
