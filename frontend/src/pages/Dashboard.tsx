import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Package, TrendingUp, Users, DollarSign,
  ArrowUpRight, ArrowDownRight, ShoppingCart, AlertTriangle
} from 'lucide-react'

const stats = [
  { label: 'Vendas Hoje', value: 'R$ 12.450', change: '+12.5%', up: true, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Pedidos', value: '34', change: '+8.2%', up: true, icon: ShoppingCart, color: 'text-primary bg-primary/10' },
  { label: 'Itens em Estoque', value: '1.284', change: '-2.1%', up: false, icon: Package, color: 'text-amber-600 bg-amber-50' },
  { label: 'Vendedores Ativos', value: '12', change: '+1', up: true, icon: Users, color: 'text-violet-600 bg-violet-50' },
]

const recentActivity = [
  { action: 'Venda realizada', detail: 'iPhone 15 Pro - R$ 9.999', time: 'Ha 5 min', type: 'venda' },
  { action: 'Entrada estoque', detail: '20x Galaxy S24 Ultra', time: 'Ha 15 min', type: 'entrada' },
  { action: 'Meta atingida', detail: 'Ana Oliveira - Jan/2025', time: 'Ha 1h', type: 'meta' },
  { action: 'Estoque critico', detail: 'Motorola Edge 50 - 1 un.', time: 'Ha 2h', type: 'alerta' },
  { action: 'NFe processada', detail: 'NFe 005678 - Samsung', time: 'Ha 3h', type: 'nfe' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="card-hover" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                    <p className="text-2xl font-bold font-display mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {stat.up ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <span className={`text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-destructive'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs ontem</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <Card className="lg:col-span-2" data-testid="recent-activity">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    item.type === 'venda' ? 'bg-emerald-500' :
                    item.type === 'entrada' ? 'bg-primary' :
                    item.type === 'meta' ? 'bg-amber-500' :
                    item.type === 'alerta' ? 'bg-destructive' :
                    'bg-muted-foreground'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-3">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card data-testid="alerts-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="destructive" className="text-[10px] h-5">Critico</Badge>
              </div>
              <p className="text-xs font-medium">Motorola Edge 50</p>
              <p className="text-[11px] text-muted-foreground">Apenas 1 unidade em estoque</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="text-[10px] h-5 bg-amber-500 text-white hover:bg-amber-600">Baixo</Badge>
              </div>
              <p className="text-xs font-medium">Xiaomi 14</p>
              <p className="text-[11px] text-muted-foreground">3 unidades (min: 5)</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="text-[10px] h-5 bg-primary text-white hover:bg-primary/90">Info</Badge>
              </div>
              <p className="text-xs font-medium">NFe Pendente</p>
              <p className="text-[11px] text-muted-foreground">2 notas aguardando processamento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
