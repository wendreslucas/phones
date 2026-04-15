import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, BarChart3, AlertTriangle, CheckCircle2, XOctagon, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { posicoesSinteticas as mockData } from '@/api/mockData'

const statusConfig: Record<string, { style: string; label: string }> = {
  normal: { style: 'bg-emerald-500 hover:bg-emerald-600 text-white', label: 'Normal' },
  baixo: { style: 'bg-amber-500 hover:bg-amber-600 text-white', label: 'Baixo' },
  critico: { style: 'bg-red-500 hover:bg-red-600 text-white', label: 'Critico' },
  excesso: { style: 'bg-violet-500 hover:bg-violet-600 text-white', label: 'Excesso' },
}

export default function PosicaoSintetica() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')

  const { data: posicoes = [] } = useQuery({ queryKey: ['posicoes-sinteticas'], queryFn: () => Promise.resolve(mockData) })

  const filtered = posicoes.filter((p) => {
    const matchSearch = p.produto.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const criticos = posicoes.filter(p => p.status === 'critico').length
  const baixos = posicoes.filter(p => p.status === 'baixo').length
  const totalItens = posicoes.reduce((a, p) => a + p.quantidadeAtual, 0)

  return (
    <div className="space-y-4" data-testid="posicao-sintetica-page">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Produtos</p><p className="text-lg font-bold font-display">{posicoes.length}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total em Estoque</p><p className="text-lg font-bold font-display">{totalItens} un.</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><XOctagon className="w-5 h-5 text-red-500" /></div>
            <div><p className="text-xs text-muted-foreground">Criticos</p><p className="text-lg font-bold font-display text-red-600">{criticos}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs text-muted-foreground">Estoque Baixo</p><p className="text-lg font-bold font-display text-amber-600">{baixos}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">Posicao Sintetica de Estoque</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-48 pl-8 text-xs" data-testid="posicao-search" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-36 text-xs" data-testid="posicao-filter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="critico">Critico</SelectItem>
                  <SelectItem value="excesso">Excesso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Produto</TableHead>
                <TableHead className="text-xs">Categoria</TableHead>
                <TableHead className="text-xs">Qtd Atual</TableHead>
                <TableHead className="text-xs">Min</TableHead>
                <TableHead className="text-xs">Max</TableHead>
                <TableHead className="text-xs w-32">Ocupacao</TableHead>
                <TableHead className="text-xs">Ult. Movim.</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const cfg = statusConfig[item.status]
                const ocupacao = Math.min((item.quantidadeAtual / item.quantidadeMaxima) * 100, 100)
                return (
                  <TableRow key={item.id} data-testid={`posicao-row-${item.id}`}>
                    <TableCell className="text-sm font-medium">{item.produto}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.categoria}</TableCell>
                    <TableCell className="text-sm font-bold">{item.quantidadeAtual}</TableCell>
                    <TableCell className="text-sm">{item.quantidadeMinima}</TableCell>
                    <TableCell className="text-sm">{item.quantidadeMaxima}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={ocupacao}
                          className={`h-1.5 flex-1 ${item.status === 'critico' ? '[&>div]:bg-red-500' : item.status === 'baixo' ? '[&>div]:bg-amber-500' : item.status === 'excesso' ? '[&>div]:bg-violet-500' : ''}`}
                        />
                        <span className="text-[10px] w-8 text-right">{ocupacao.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.ultimaMovimentacao}</TableCell>
                    <TableCell><Badge className={`text-[10px] ${cfg?.style || ''}`}>{cfg?.label || item.status}</Badge></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
