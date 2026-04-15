import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { Plus, Search, ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine, Repeat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { movimentacoes as mockData } from '@/api/mockData'
import type { MovimentacaoEstoque } from '@/types/estoque'

const validationSchema = Yup.object({
  tipo: Yup.string().oneOf(['entrada', 'saida', 'transferencia']).required('Tipo obrigatorio'),
  produto: Yup.string().required('Produto obrigatorio'),
  quantidade: Yup.number().min(1, 'Quantidade minima: 1').required('Quantidade obrigatoria'),
  motivo: Yup.string().required('Motivo obrigatorio'),
  responsavel: Yup.string().required('Responsavel obrigatorio'),
  observacao: Yup.string(),
})

const tipoStyles: Record<string, { icon: typeof ArrowDownToLine; style: string; label: string }> = {
  entrada: { icon: ArrowDownToLine, style: 'bg-emerald-500 hover:bg-emerald-600 text-white', label: 'Entrada' },
  saida: { icon: ArrowUpFromLine, style: 'bg-red-400 hover:bg-red-500 text-white', label: 'Saida' },
  transferencia: { icon: Repeat, style: 'bg-primary hover:bg-primary/90 text-white', label: 'Transferencia' },
}

export default function Movimentacao() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: movimentacoes = [] } = useQuery({ queryKey: ['movimentacoes'], queryFn: () => Promise.resolve(mockData) })

  const mutation = useMutation({
    mutationFn: (values: Partial<MovimentacaoEstoque>) => Promise.resolve(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['movimentacoes'] }); toast.success('Movimentacao registrada!'); setDialogOpen(false); formik.resetForm() },
  })

  const formik = useFormik({
    initialValues: { tipo: 'entrada' as string, produto: '', quantidade: 1, motivo: '', responsavel: '', observacao: '' },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
  })

  const filtered = movimentacoes.filter((m) => {
    const matchSearch = m.produto.toLowerCase().includes(search.toLowerCase())
    const matchTipo = tipoFilter === 'todos' || m.tipo === tipoFilter
    return matchSearch && matchTipo
  })

  const totalEntradas = movimentacoes.filter(m => m.tipo === 'entrada').reduce((a, m) => a + m.quantidade, 0)
  const totalSaidas = movimentacoes.filter(m => m.tipo === 'saida').reduce((a, m) => a + m.quantidade, 0)

  return (
    <div className="space-y-4" data-testid="movimentacao-page">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><ArrowLeftRight className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Total Movim.</p><p className="text-lg font-bold font-display">{movimentacoes.length}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><ArrowDownToLine className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-xs text-muted-foreground">Entradas</p><p className="text-lg font-bold font-display">{totalEntradas} un.</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><ArrowUpFromLine className="w-5 h-5 text-red-500" /></div>
            <div><p className="text-xs text-muted-foreground">Saidas</p><p className="text-lg font-bold font-display">{totalSaidas} un.</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Repeat className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs text-muted-foreground">Transferencias</p><p className="text-lg font-bold font-display">{movimentacoes.filter(m => m.tipo === 'transferencia').length}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">Movimentacao de Estoque</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-48 pl-8 text-xs" data-testid="movimentacao-search" />
              </div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="h-8 w-36 text-xs" data-testid="movimentacao-filter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Tipos</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saida</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { formik.resetForm(); setDialogOpen(true) }} data-testid="movimentacao-add-btn"><Plus className="w-3.5 h-3.5" /> Nova Movimentacao</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Produto</TableHead>
                <TableHead className="text-xs">Qtd</TableHead>
                <TableHead className="text-xs">Motivo</TableHead>
                <TableHead className="text-xs">Responsavel</TableHead>
                <TableHead className="text-xs">Data</TableHead>
                <TableHead className="text-xs">Obs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const cfg = tipoStyles[item.tipo]
                return (
                  <TableRow key={item.id} data-testid={`movimentacao-row-${item.id}`}>
                    <TableCell><Badge className={`text-[10px] ${cfg?.style || ''}`}>{cfg?.label || item.tipo}</Badge></TableCell>
                    <TableCell className="text-sm font-medium">{item.produto}</TableCell>
                    <TableCell className="text-sm font-medium">{item.quantidade}</TableCell>
                    <TableCell className="text-sm">{item.motivo}</TableCell>
                    <TableCell className="text-sm">{item.responsavel}</TableCell>
                    <TableCell className="text-sm">{item.data}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{item.observacao}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="movimentacao-dialog">
          <DialogHeader><DialogTitle className="font-display text-base">Nova Movimentacao</DialogTitle></DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo</Label>
              <Select value={formik.values.tipo} onValueChange={(v) => formik.setFieldValue('tipo', v)}>
                <SelectTrigger className="h-9 text-sm" data-testid="movimentacao-tipo"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saida</SelectItem><SelectItem value="transferencia">Transferencia</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Produto</Label>
                <Input name="produto" value={formik.values.produto} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`h-9 text-sm ${formik.touched.produto && formik.errors.produto ? 'border-destructive' : ''}`} data-testid="movimentacao-produto" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Quantidade</Label>
                <Input name="quantidade" type="number" min={1} value={formik.values.quantidade} onChange={formik.handleChange} className={`h-9 text-sm ${formik.touched.quantidade && formik.errors.quantidade ? 'border-destructive' : ''}`} data-testid="movimentacao-qtd" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Motivo</Label>
                <Input name="motivo" value={formik.values.motivo} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`h-9 text-sm ${formik.touched.motivo && formik.errors.motivo ? 'border-destructive' : ''}`} data-testid="movimentacao-motivo" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Responsavel</Label>
                <Input name="responsavel" value={formik.values.responsavel} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`h-9 text-sm ${formik.touched.responsavel && formik.errors.responsavel ? 'border-destructive' : ''}`} data-testid="movimentacao-responsavel" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Observacao</Label>
              <Textarea name="observacao" value={formik.values.observacao} onChange={formik.handleChange} className="text-sm min-h-[50px]" data-testid="movimentacao-obs" />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" size="sm" data-testid="movimentacao-submit-btn">Registrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
