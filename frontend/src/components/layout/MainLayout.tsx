import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '../ui/sonner';

const pageTitles: Record<string, string> = {
  '/': 'Bem vindo ao Store Web !',
  '/vendas': 'Minhas vendas',
  '/loja/nova': 'Cadastro da Loja',
  '/loja/colaboradores': 'Colaboradores e Lojas',
  '/loja/comissao': 'Comissão',
  '/loja/descontos': 'Descontos',
  '/loja/metas': 'Metas de Venda',
  '/cadastro/produtos': 'Cadastro de Produtos',
  '/cadastro/categorias': 'Categorias',
  '/cadastro/fornecedores': 'Fornecedores',
  '/estoque/consulta': 'Consultar Estoque',
  '/estoque/entrada': 'Entrada de Produtos',
  '/estoque/ajuste': 'Ajuste de Estoque',
  '/transferencia/nova': 'Nova Transferência',
  '/transferencia/historico': 'Histórico de Transferências',
  '/relatorio/vendas': 'Relatório de Vendas',
  '/relatorio/estoque': 'Relatório de Estoque',
  '/relatorio/financeiro': 'Relatório Financeiro',
  '/lancamentos': 'Lançamentos/Contas',
  '/financeiro': 'uCase - Financeiro',
  '/perfil': 'Meu Perfil',
};

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const title = pageTitles[location.pathname] || 'Store Web';

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={title} 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;
