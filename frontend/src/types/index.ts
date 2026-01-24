// User types
export interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  avatar?: string;
  cargo: CargoType;
  lojas: Loja[];
}

export type CargoType = 
  | 'proprietario'
  | 'administrador'
  | 'gerente'
  | 'subgerente'
  | 'caixa'
  | 'vendedor'
  | 'trainee'
  | 'tecnico'
  | 'contador';

export const cargoLabels: Record<CargoType, string> = {
  proprietario: 'Proprietário',
  administrador: 'Administrador',
  gerente: 'Gerente',
  subgerente: 'Subgerente',
  caixa: 'Caixa',
  vendedor: 'Vendedor',
  trainee: 'Trainee',
  tecnico: 'Técnico',
  contador: 'Contador',
};

// Loja types
export interface Loja {
  id: string;
  nome: string;
  tipo: TipoLoja;
  cnpj: string;
  endereco: Endereco;
  telefone: string;
  email: string;
  responsavel: string;
  status: 'ativo' | 'inativo';
}

export type TipoLoja = 'shopping' | 'rua' | 'quiosque';

export const tipoLojaLabels: Record<TipoLoja, string> = {
  shopping: 'Loja de Shopping',
  rua: 'Loja de Rua',
  quiosque: 'Quiosque',
};

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Venda types
export interface Venda {
  id: string;
  data: string;
  valor: number;
  categoria: string;
  quantidade: number;
  lojaId: string;
  vendedorId: string;
  status: 'concluida' | 'pendente' | 'cancelada' | 'devolvida';
}

export interface VendaAgrupada {
  categoria: string;
  quantidade: number;
  totalVendas: number;
  quantidadeDevolvido: number;
  totalVendido: number;
  totalGeral: number;
}

export interface VendaDiaria {
  dia: string;
  valor: number;
}

// Ranking types
export interface RankingItem {
  posicao: number;
  nome: string;
  valor: number;
  percentual: number;
}

// Menu types
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  badge?: string;
  children?: MenuItem[];
}

// Form types for store registration
export interface NovaLojaFormData {
  // Responsável
  responsavelNome: string;
  responsavelSobrenome: string;
  responsavelEmail: string;
  responsavelCpf: string;
  responsavelCelular: string;
  
  // Tipo de Loja
  tipoLoja: TipoLoja;
  
  // Loja
  lojaNome: string;
  lojaCnpj: string;
  lojaInscricaoEstadual: string;
  lojaEndereco: Endereco;
  lojaTelefone: string;
  lojaEmail: string;
  
  // Colaboradores
  colaboradores: ColaboradorForm[];
}

export interface ColaboradorForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  celular: string;
  cargo: CargoType;
}

// News/Announcement types
export interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  imagemUrl?: string;
  autor: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
