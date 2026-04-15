import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, FileText, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { nfesFornecedor as mockData } from '@/api/mockData'
import type { NfeFornecedor } from '@/types/estoque'

const statusConfig: Record<string, { style: string; label: string; icon: typeof CheckCircle2 }> = {
  pendente: { style: 'bg-amber-500 hover:bg-amber-600 text-white', label: 'Pendente', icon: Clock },
  processada: { style: 'bg-emerald-500 hover:bg-emerald-600 text-white', label: 'Processada', icon: CheckCircle2 },
  cancelada: { style: 'bg-red-400 hover:bg-red-500 text-white', label: 'Cancelada', icon: XCircle },
}

export default function NfeFornecedorPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [detailItem, setDetailItem] = useState<NfeFornecedor | null>(null)

  const { data: nfes = [] } = useQuery({ queryKey: ['nfes-fornecedor'], queryFn: () => Promise.resolve(mockData) })

  const filtered = nfes.filter((n) => {
    const matchSearch = n.numero.includes(search) || n.fornecedor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || n.status === statusFilter
    return matchSearch && matchStatus
  })

  const valorTotal = nfes.reduce((a, n) => a + n.valorTotal, 0)
  const pendentes = nfes.filter(n => n.status === 'pendente').length

  return (
    <div className="space-y-4" data-testid="nfe-fornecedor-page">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Total NFes</p><p className="text-lg font-bold font-display">{nfes.length}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-xs text-muted-foreground">Processadas</p><p className="text-lg font-bold font-display">{nfes.filter(n => n.status === 'processada').length}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs text-muted-foreground">Pendentes</p><p className="text-lg font-bold font-display">{pendentes}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><FileText className="w-5 h-5 text-violet-600" /></div>
            <div><p className="text-xs text-muted-foreground">Valor Total</p><p className="text-lg font-bold font-display">R$ {(valorTotal / 1000).toFixed(0)}k</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">NFe Fornecedor</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar NFe ou fornecedor..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-52 pl-8 text-xs" data-testid="nfe-search" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-36 text-xs" data-testid="nfe-filter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="processada">Processada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Numero/Serie</TableHead>
                <TableHead className="text-xs">Fornecedor</TableHead>
                <TableHead className="text-xs">CNPJ</TableHead>
                <TableHead className="text-xs">Emissao</TableHead>
                <TableHead className="text-xs">Entrada</TableHead>
                <TableHead className="text-xs">Valor Total</TableHead>
                <TableHead className="text-xs">Itens</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-14">Ver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const cfg = statusConfig[item.status]
                return (
                  <TableRow key={item.id} data-testid={`nfe-row-${item.id}`}>
                    <TableCell className="text-sm font-mono">{item.numero}/{item.serie}</TableCell>
                    <TableCell className="text-sm font-medium">{item.fornecedor}</TableCell>
                    <TableCell className="text-xs font-mono">{item.cnpjFornecedor}</TableCell>
                    <TableCell className="text-sm">{item.dataEmissao}</TableCell>
                    <TableCell className="text-sm">{item.dataEntrada || '-'}</TableCell>
                    <TableCell className="text-sm font-medium">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-sm">{item.itens}</TableCell>
                    <TableCell><Badge className={`text-[10px] ${cfg?.style || ''}`}>{cfg?.label || item.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailItem(item)} data-testid={`view-nfe-${item.id}`}><Eye className="w-3.5 h-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="sm:max-w-md" data-testid="nfe-detail-dialog">
          <DialogHeader><DialogTitle className="font-display text-base">Detalhes NFe {detailItem?.numero}</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Numero/Serie</span><p className="font-medium font-mono">{detailItem.numero}/{detailItem.serie}</p></div>
                <div><span className="text-muted-foreground text-xs">Status</span><p><Badge className={`text-[10px] ${statusConfig[detailItem.status]?.style || ''}`}>{statusConfig[detailItem.status]?.label}</Badge></p></div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Fornecedor</span><p className="font-medium">{detailItem.fornecedor}</p></div>
                <div><span className="text-muted-foreground text-xs">CNPJ</span><p className="font-mono text-xs">{detailItem.cnpjFornecedor}</p></div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Emissao</span><p>{detailItem.dataEmissao}</p></div>
                <div><span className="text-muted-foreground text-xs">Entrada</span><p>{detailItem.dataEntrada || '-'}</p></div>
                <div><span className="text-muted-foreground text-xs">Itens</span><p>{detailItem.itens}</p></div>
              </div>
              <Separator />
              <div className="text-sm">
                <span className="text-muted-foreground text-xs">Valor Total</span>
                <p className="text-xl font-bold font-display text-primary">R$ {detailItem.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
