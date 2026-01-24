import axios, { AxiosInstance, AxiosError } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    // Mock implementation - will be replaced with real API
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email && password) {
      return {
        user: {
          id: '1',
          nome: 'William',
          sobrenome: 'Silva',
          email,
          cargo: 'proprietario' as const,
          lojas: [
            { id: '1', nome: 'DTUDO CELULAR PÁTIO 2-AL' },
            { id: '2', nome: 'MUNDO DO CELULAR CENTRO' },
          ],
        },
        token: 'mock-jwt-token',
      };
    }
    throw new Error('Credenciais inválidas');
  },
  
  logout: async () => {
    localStorage.removeItem('auth_token');
  },
  
  getCurrentUser: async () => {
    // Mock implementation
    return {
      id: '1',
      nome: 'William',
      sobrenome: 'Silva',
      email: 'william@example.com',
      cargo: 'proprietario' as const,
      lojas: [
        { id: '1', nome: 'DTUDO CELULAR PÁTIO 2-AL', tipo: 'shopping' as const, cnpj: '', endereco: {} as any, telefone: '', email: '', responsavel: '', status: 'ativo' as const },
        { id: '2', nome: 'MUNDO DO CELULAR CENTRO', tipo: 'rua' as const, cnpj: '', endereco: {} as any, telefone: '', email: '', responsavel: '', status: 'ativo' as const },
      ],
    };
  },
};

// Vendas API
export const vendasApi = {
  getVendasDiarias: async (lojaId: string, dias: number = 7) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    const hoje = new Date();
    return Array.from({ length: dias }, (_, i) => {
      const data = new Date(hoje);
      data.setDate(data.getDate() - (dias - 1 - i));
      return {
        dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        valor: Math.random() * 5000 + 1000,
      };
    });
  },
  
  getVendasAgrupadas: async (lojaId: string) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { categoria: 'Celulares', quantidade: 15, totalVendas: 25000, quantidadeDevolvido: 2, totalVendido: 23000, totalGeral: 23000 },
      { categoria: 'Acessórios', quantidade: 45, totalVendas: 8500, quantidadeDevolvido: 5, totalVendido: 7500, totalGeral: 7500 },
      { categoria: 'Capas', quantidade: 80, totalVendas: 4000, quantidadeDevolvido: 3, totalVendido: 3850, totalGeral: 3850 },
      { categoria: 'Películas', quantidade: 120, totalVendas: 3600, quantidadeDevolvido: 8, totalVendido: 3360, totalGeral: 3360 },
    ];
  },
  
  getRankingLoja: async (lojaId: string) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { posicao: 1, nome: 'Maria Silva', valor: 45000, percentual: 28 },
      { posicao: 2, nome: 'João Santos', valor: 38000, percentual: 24 },
      { posicao: 3, nome: 'Ana Oliveira', valor: 32000, percentual: 20 },
      { posicao: 4, nome: 'Pedro Costa', valor: 28000, percentual: 18 },
      { posicao: 5, nome: 'Lucas Ferreira', valor: 16000, percentual: 10 },
    ];
  },
  
  getRankingGeral: async () => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { posicao: 1, nome: 'DTUDO CELULAR PÁTIO', valor: 180000, percentual: 35 },
      { posicao: 2, nome: 'MUNDO DO CELULAR', valor: 150000, percentual: 29 },
      { posicao: 3, nome: 'LOJA CENTRO', valor: 120000, percentual: 23 },
      { posicao: 4, nome: 'QUIOSQUE MALL', valor: 68000, percentual: 13 },
    ];
  },
};

// Lojas API
export const lojasApi = {
  getLojas: async () => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: '1',
        nome: 'DTUDO CELULAR PÁTIO 2-AL',
        tipo: 'shopping' as const,
        cnpj: '12.345.678/0001-90',
        endereco: {
          cep: '57000-000',
          logradouro: 'Av. Gustavo Paiva',
          numero: '2990',
          bairro: 'Mangabeiras',
          cidade: 'Maceió',
          estado: 'AL',
        },
        telefone: '(82) 3333-4444',
        email: 'dtudo@example.com',
        responsavel: 'William Silva',
        status: 'ativo' as const,
      },
      {
        id: '2',
        nome: 'MUNDO DO CELULAR CENTRO',
        tipo: 'rua' as const,
        cnpj: '98.765.432/0001-10',
        endereco: {
          cep: '57020-000',
          logradouro: 'Rua do Comércio',
          numero: '150',
          bairro: 'Centro',
          cidade: 'Maceió',
          estado: 'AL',
        },
        telefone: '(82) 2222-3333',
        email: 'mundo@example.com',
        responsavel: 'William Silva',
        status: 'ativo' as const,
      },
    ];
  },
  
  createLoja: async (data: any) => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: Date.now().toString() };
  },
};

// Notícias API
export const noticiasApi = {
  getNoticias: async () => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve: 300));
    return [
      {
        id: '1',
        titulo: 'Sua Empresa Preparada para a Reforma Tributária com a uCase!',
        conteudo: `Prezado(a) Cliente,

A Reforma Tributária trará importantes mudanças fiscais a partir de janeiro de 2026, com impacto direto na emissão da Nota Fiscal Eletrônica (NFe), que passará a incluir novas informações tributárias devido a impostos como o IBS e a CBS.

Para garantir que sua empresa esteja totalmente em conformidade, a uCase está empenhada em atualizar nosso software.

Em outubro de 2025, realizaremos os desenvolvimentos necessários no módulo de faturamento e, em novembro de 2025, faremos a atualização do sistema.

Posteriormente, nossa equipe entrará em contato para orientá-lo(a) sobre os ajustes nos cadastros de produtos.

Outra mudança importante é a descontinuação do equipamento SAT. Se sua loja utiliza o SAT, será necessário migrar para a emissão da NFCe.

Pedimos que entre em contato conosco o mais breve possível para que possamos planejar e executar essa transição de forma tranquila e eficiente!

Conte com a uCase para manter sua operação atualizada e funcionando sem interrupções.
Estamos à disposição para qualquer dúvida!`,
        dataPublicacao: '2025-01-15',
        imagemUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        autor: 'uCTeam uCase',
      },
    ];
  },
};
