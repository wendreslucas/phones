import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  TrendingUp, 
  Store, 
  ClipboardList, 
  Package, 
  Truck, 
  FileText, 
  DollarSign,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  badge?: string;
}

interface MenuItemData {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  children?: SubMenuItem[];
}

const menuItems: MenuItemData[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} />, path: '/' },
  { id: 'vendas', label: 'Minhas vendas', icon: <TrendingUp size={20} />, path: '/vendas' },
  { 
    id: 'loja', 
    label: 'Loja', 
    icon: <Store size={20} />,
    children: [
      { id: 'nova-loja', label: 'Nova Loja', path: '/loja/nova' },
      { id: 'colaboradores', label: 'Colaboradores e Lojas', path: '/loja/colaboradores' },
      { id: 'comissao', label: 'Comissão', path: '/loja/comissao' },
      { id: 'descontos', label: 'Descontos', path: '/loja/descontos' },
      { id: 'metas', label: 'Metas de Venda', path: '/loja/metas', badge: 'Novo' },
    ]
  },
  { 
    id: 'cadastro', 
    label: 'Cadastro', 
    icon: <ClipboardList size={20} />,
    badge: 'Novo',
    children: [
      { id: 'produtos', label: 'Produtos', path: '/cadastro/produtos' },
      { id: 'categorias', label: 'Categorias', path: '/cadastro/categorias' },
      { id: 'fornecedores', label: 'Fornecedores', path: '/cadastro/fornecedores' },
    ]
  },
  { 
    id: 'estoque', 
    label: 'Estoque', 
    icon: <Package size={20} />,
    badge: 'Novo',
    children: [
      { id: 'consulta', label: 'Consultar Estoque', path: '/estoque/consulta' },
      { id: 'entrada', label: 'Entrada de Produtos', path: '/estoque/entrada' },
      { id: 'ajuste', label: 'Ajuste de Estoque', path: '/estoque/ajuste' },
    ]
  },
  { 
    id: 'transferencia', 
    label: 'Transferência', 
    icon: <Truck size={20} />,
    children: [
      { id: 'nova-transf', label: 'Nova Transferência', path: '/transferencia/nova' },
      { id: 'historico', label: 'Histórico', path: '/transferencia/historico' },
    ]
  },
  { 
    id: 'relatorio', 
    label: 'Relatório', 
    icon: <FileText size={20} />,
    badge: 'Novo',
    children: [
      { id: 'vendas-rel', label: 'Vendas', path: '/relatorio/vendas' },
      { id: 'estoque-rel', label: 'Estoque', path: '/relatorio/estoque' },
      { id: 'financeiro-rel', label: 'Financeiro', path: '/relatorio/financeiro' },
    ]
  },
  { id: 'lancamentos', label: 'Lançamentos/Contas', icon: <DollarSign size={20} />, path: '/lancamentos' },
  { id: 'financeiro', label: 'uCase - Financeiro', icon: <DollarSign size={20} />, path: '/financeiro', badge: 'Novo' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['loja']);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (children?: SubMenuItem[]) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col",
          "sidebar-gradient text-sidebar-foreground",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-6 px-4 border-b border-white/10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-2 shadow-lg">
              <Store className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight">MUNDO DO CELULAR</h1>
            <span className="text-xs text-white/70 tracking-wider">LUGAR DE COMPRAR BARATO</span>
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Section */}
        <div 
          className="flex items-center gap-3 px-4 py-4 mx-4 mt-4 rounded-xl bg-white/10 cursor-pointer hover:bg-white/15 transition-colors"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          <Avatar className="h-12 w-12 border-2 border-white/30">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
              {user?.nome?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{user?.nome || 'Usuário'}</p>
          </div>
          <ChevronDown 
            size={20} 
            className={cn(
              "transition-transform duration-200",
              isUserMenuOpen && "rotate-180"
            )} 
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.id}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className={cn(
                        "menu-item w-full text-left",
                        (expandedItems.includes(item.id) || isParentActive(item.children)) && "bg-white/10"
                      )}
                    >
                      <span className="text-white/80">{item.icon}</span>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-accent text-accent-foreground text-xs px-2">
                          {item.badge}
                        </Badge>
                      )}
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown size={18} className="text-white/60" />
                      ) : (
                        <ChevronRight size={18} className="text-white/60" />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    <div className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedItems.includes(item.id) ? "max-h-96" : "max-h-0"
                    )}>
                      <ul className="ml-4 mt-1 space-y-1 bg-white rounded-lg p-2 shadow-lg">
                        {item.children.map(child => (
                          <li key={child.id}>
                            <Link
                              to={child.path}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors",
                                "text-foreground hover:bg-muted",
                                isActive(child.path) && "bg-primary/10 text-primary font-medium"
                              )}
                            >
                              <span>{child.label}</span>
                              {child.badge && (
                                <Badge className="bg-accent text-accent-foreground text-xs px-1.5">
                                  {child.badge}
                                </Badge>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path || '/'}
                    onClick={onClose}
                    className={cn(
                      "menu-item",
                      isActive(item.path) && "active"
                    )}
                  >
                    <span className="text-white/80">{item.icon}</span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-accent text-accent-foreground text-xs px-2">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="menu-item w-full text-left text-white/80 hover:text-white"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
