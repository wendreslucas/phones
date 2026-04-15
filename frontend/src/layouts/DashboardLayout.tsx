import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Store, ClipboardList, Package,
  ChevronDown, ChevronRight, Menu, X, Bell,
  Search, User, Settings, LogOut,
  Percent, Tag, Target, Smartphone,
  CreditCard, Shield, Layers, Truck,
  ArrowLeftRight, FileText, BarChart3, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface NavGroup {
  label: string
  icon: React.ElementType
  basePath: string
  items: { label: string; path: string; icon: React.ElementType }[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Loja',
    icon: Store,
    basePath: '/loja',
    items: [
      { label: 'Comissoes', path: '/loja/comissoes', icon: Percent },
      { label: 'Descontos', path: '/loja/descontos', icon: Tag },
      { label: 'Metas de Venda', path: '/loja/metas-venda', icon: Target },
    ],
  },
  {
    label: 'Cadastro',
    icon: ClipboardList,
    basePath: '/cadastro',
    items: [
      { label: 'Gestao IMEI', path: '/cadastro/imei', icon: Smartphone },
      { label: 'Cartao', path: '/cadastro/cartao', icon: CreditCard },
      { label: 'Grupo Permissao', path: '/cadastro/grupo-permissao', icon: Shield },
      { label: 'Grupo de Contas', path: '/cadastro/grupo-contas', icon: Layers },
      { label: 'Fornecedor', path: '/cadastro/fornecedor', icon: Truck },
    ],
  },
  {
    label: 'Estoque',
    icon: Package,
    basePath: '/estoque',
    items: [
      { label: 'Movimentacao', path: '/estoque/movimentacao', icon: ArrowLeftRight },
      { label: 'NFe Fornecedor', path: '/estoque/nfe-fornecedor', icon: FileText },
      { label: 'Posicao Sintetica', path: '/estoque/posicao-sintetica', icon: BarChart3 },
      { label: 'Estoque Valorizado', path: '/estoque/estoque-valorizado', icon: DollarSign },
    ],
  },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Loja', 'Cadastro', 'Estoque'])
  const location = useLocation()

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    )
  }

  const currentPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard'
    for (const group of navGroups) {
      for (const item of group.items) {
        if (location.pathname === item.path) return item.label
      }
    }
    return 'Dashboard'
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <Store className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold text-white font-display tracking-tight">StoreAdmin</h1>
            <p className="text-[10px] text-white/60 uppercase tracking-widest">Gestao de Loja</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <div className="px-3 space-y-1">
          {/* Dashboard link */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `menu-item text-sm ${isActive ? 'active bg-white/15 text-white font-medium' : 'text-white/70 hover:text-white'}`
            }
            data-testid="nav-dashboard"
          >
            <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          {sidebarOpen && <div className="pt-2"><Separator className="bg-white/10" /></div>}

          {/* Grouped Navigation */}
          {navGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.label)
            const isGroupActive = location.pathname.startsWith(group.basePath)
            const GroupIcon = group.icon

            return (
              <div key={group.label} className="pt-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`menu-item text-sm w-full ${isGroupActive ? 'text-white font-medium' : 'text-white/70 hover:text-white'}`}
                  data-testid={`nav-group-${group.label.toLowerCase()}`}
                >
                  <GroupIcon className="w-[18px] h-[18px] shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{group.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </>
                  )}
                </button>

                {sidebarOpen && isExpanded && (
                  <div className="ml-4 pl-3 border-l border-white/10 space-y-0.5 mt-0.5 animate-fade-in">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-150 ${
                              isActive
                                ? 'bg-white/15 text-white font-medium'
                                : 'text-white/55 hover:text-white hover:bg-white/5'
                            }`
                          }
                          data-testid={`nav-${item.path.split('/').pop()}`}
                        >
                          <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-white/10 p-3">
        <div className="menu-item text-sm text-white/70">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-white/20 text-white text-xs font-medium">AD</AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-white text-xs font-medium truncate">Admin</p>
              <p className="text-white/50 text-[10px] truncate">admin@storeadmin.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex" data-testid="dashboard-layout">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sidebar-gradient transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-[68px]'
        }`}
        data-testid="sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 sidebar-gradient animate-slide-in-left z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0" data-testid="header">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileSidebarOpen(true)}
              data-testid="mobile-menu-btn"
            >
              <Menu className="w-4 h-4" />
            </Button>
            {/* Desktop collapse */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="sidebar-toggle-btn"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <h2 className="text-sm font-semibold text-foreground font-display">{currentPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="h-8 w-52 pl-8 text-xs bg-muted/50 border-0"
                data-testid="header-search"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-8 w-8 relative" data-testid="notifications-btn">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="user-menu-btn">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem><User className="w-3.5 h-3.5 mr-2" /> Perfil</DropdownMenuItem>
                <DropdownMenuItem><Settings className="w-3.5 h-3.5 mr-2" /> Configuracoes</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><LogOut className="w-3.5 h-3.5 mr-2" /> Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
