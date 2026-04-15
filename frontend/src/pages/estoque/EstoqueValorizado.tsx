import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, DollarSign, Package, TrendingUp, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { estoqueValorizado as mockData } from '@/api/mockData'

export default function EstoqueValorizadoPage() {
  const [search, setSearch] = useState('')

  const { data: estoque = [] } = useQuery({ queryKey: ['estoque-valorizado'], queryFn: () => Promise.resolve(mockData) })

  const filtered = estoque.filter((e) => e.produto.toLowerCase().includes(search.toLowerCase()))

  const totalCusto = estoque.reduce((a, e) => a + e.custoTotal, 0)
  const totalVenda = estoque.reduce((a, e) => a + e.valorTotalEstoque, 0)
  const totalItens = estoque.reduce((a, e) => a + e.quantidade, 0)
  const margemMedia = estoque.length > 0 ? estoque.reduce((a, e) => a + e.margemLucro, 0) / estoque.length : 0

  return (
    <div className="space-y-4" data-testid="estoque-valorizado-page">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Custo Total</p><p className="text-lg font-bold font-display">R$ {(totalCusto / 1000).toFixed(0)}k</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-xs text-muted-foreground">Valor Venda</p><p className="text-lg font-bold font-display">R$ {(totalVenda / 1000).toFixed(0)}k</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs text-muted-foreground">Margem Media</p><p className="text-lg font-bold font-display">{margemMedia.toFixed(1)}%</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><Package className="w-5 h-5 text-violet-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Itens</p><p className="text-lg font-bold font-display">{totalItens} un.</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">Estoque Valorizado</CardTitle>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-48 pl-8 text-xs" data-testid="estoque-valorizado-search" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Produto</TableHead>
                <TableHead className="text-xs">Categoria</TableHead>
                <TableHead className="text-xs text-right">Qtd</TableHead>
                <TableHead className="text-xs text-right">Custo Unit.</TableHead>
                <TableHead className="text-xs text-right">Custo Total</TableHead>
                <TableHead className="text-xs text-right">Preco Venda</TableHead>
                <TableHead className="text-xs text-right">Margem</TableHead>
                <TableHead className="text-xs text-right">Valor Estoque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} data-testid={`estoque-valorizado-row-${item.id}`}>
                  <TableCell className="text-sm font-medium">{item.produto}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.categoria}</TableCell>
                  <TableCell className="text-sm text-right">{item.quantidade}</TableCell>
                  <TableCell className="text-sm text-right">R$ {item.custoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-sm text-right">R$ {item.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-sm text-right">R$ {item.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-sm text-right">
                    <span className={`font-medium ${item.margemLucro >= 50 ? 'text-emerald-600' : item.margemLucro >= 25 ? 'text-primary' : 'text-amber-600'}`}>
                      {item.margemLucro.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-right font-bold">R$ {item.valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="text-sm" colSpan={2}>TOTAL</TableCell>
                <TableCell className="text-sm text-right">{totalItens}</TableCell>
                <TableCell className="text-sm text-right">-</TableCell>
                <TableCell className="text-sm text-right">R$ {totalCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-sm text-right">-</TableCell>
                <TableCell className="text-sm text-right">{margemMedia.toFixed(1)}%</TableCell>
                <TableCell className="text-sm text-right">R$ {totalVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
