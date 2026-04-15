import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { Plus, Search, Pencil, Trash2, Percent, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { comissoes as mockData } from '@/api/mockData'
import type { Comissao } from '@/types/loja'

const validationSchema = Yup.object({
  vendedor: Yup.string().required('Vendedor obrigatorio'),
  tipo: Yup.string().oneOf(['percentual', 'valor_fixo']).required('Tipo obrigatorio'),
  valor: Yup.number().min(0, 'Valor deve ser positivo').required('Valor obrigatorio'),
  metaMinima: Yup.number().min(0, 'Meta deve ser positiva').required('Meta obrigatoria'),
  periodo: Yup.string().required('Periodo obrigatorio'),
  status: Yup.string().oneOf(['ativo', 'inativo']).required('Status obrigatorio'),
})

export default function Comissoes() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Comissao | null>(null)

  const { data: comissoes = [] } = useQuery({
    queryKey: ['comissoes'],
    queryFn: () => Promise.resolve(mockData),
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<Comissao>) => Promise.resolve(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comissoes'] })
      toast.success(editItem ? 'Comissao atualizada!' : 'Comissao criada!')
      closeDialog()
    },
  })

  const formik = useFormik({
    initialValues: {
      vendedor: '',
      tipo: 'percentual' as 'percentual' | 'valor_fixo',
      valor: 0,
      metaMinima: 0,
      periodo: '',
      status: 'ativo' as 'ativo' | 'inativo',
    },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
  })

  const openCreate = () => {
    setEditItem(null)
    formik.resetForm()
    setDialogOpen(true)
  }

  const openEdit = (item: Comissao) => {
    setEditItem(item)
    formik.setValues({
      vendedor: item.vendedor,
      tipo: item.tipo,
      valor: item.valor,
      metaMinima: item.metaMinima,
      periodo: item.periodo,
      status: item.status,
    })
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditItem(null)
    formik.resetForm()
  }

  const filtered = comissoes.filter((c) =>
    c.vendedor.toLowerCase().includes(search.toLowerCase())
  )

  const totalAtivas = comissoes.filter((c) => c.status === 'ativo').length

  return (
    <div className="space-y-4" data-testid="comissoes-page">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Percent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Comissoes</p>
              <p className="text-lg font-bold font-display">{comissoes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ativas</p>
              <p className="text-lg font-bold font-display">{totalAtivas}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Percent className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Media Comissao (%)</p>
              <p className="text-lg font-bold font-display">
                {(() => { const perc = comissoes.filter(c => c.tipo === 'percentual'); return perc.length ? (perc.reduce((a, c) => a + c.valor, 0) / perc.length).toFixed(1) : '0' })()}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">Comissoes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar vendedor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs"
                  data-testid="comissoes-search"
                />
              </div>
              <Button size="sm" className="h-8 text-xs gap-1.5" onClick={openCreate} data-testid="comissoes-add-btn">
                <Plus className="w-3.5 h-3.5" /> Nova Comissao
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Vendedor</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Valor</TableHead>
                <TableHead className="text-xs">Meta Minima</TableHead>
                <TableHead className="text-xs">Periodo</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-20">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} data-testid={`comissao-row-${item.id}`}>
                  <TableCell className="text-sm font-medium">{item.vendedor}</TableCell>
                  <TableCell className="text-sm capitalize">{item.tipo.replace('_', ' ')}</TableCell>
                  <TableCell className="text-sm">
                    {item.tipo === 'percentual' ? `${item.valor}%` : `R$ ${item.valor.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="text-sm">R$ {item.metaMinima.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-sm">{item.periodo}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'ativo' ? 'default' : 'secondary'} className="text-[10px]">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)} data-testid={`edit-comissao-${item.id}`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" data-testid={`delete-comissao-${item.id}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="comissao-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {editItem ? 'Editar Comissao' : 'Nova Comissao'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Vendedor</Label>
              <Input
                name="vendedor"
                value={formik.values.vendedor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nome do vendedor"
                className={`h-9 text-sm ${formik.touched.vendedor && formik.errors.vendedor ? 'border-destructive' : ''}`}
                data-testid="comissao-vendedor"
              />
              {formik.touched.vendedor && formik.errors.vendedor && (
                <p className="text-[11px] text-destructive">{formik.errors.vendedor}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tipo</Label>
                <Select value={formik.values.tipo} onValueChange={(v) => formik.setFieldValue('tipo', v)}>
                  <SelectTrigger className="h-9 text-sm" data-testid="comissao-tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual</SelectItem>
                    <SelectItem value="valor_fixo">Valor Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Valor</Label>
                <Input
                  name="valor"
                  type="number"
                  value={formik.values.valor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.valor && formik.errors.valor ? 'border-destructive' : ''}`}
                  data-testid="comissao-valor"
                />
                {formik.touched.valor && formik.errors.valor && (
                  <p className="text-[11px] text-destructive">{formik.errors.valor}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Meta Minima (R$)</Label>
                <Input
                  name="metaMinima"
                  type="number"
                  value={formik.values.metaMinima}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.metaMinima && formik.errors.metaMinima ? 'border-destructive' : ''}`}
                  data-testid="comissao-meta"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Periodo</Label>
                <Input
                  name="periodo"
                  value={formik.values.periodo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="2025-01"
                  className={`h-9 text-sm ${formik.touched.periodo && formik.errors.periodo ? 'border-destructive' : ''}`}
                  data-testid="comissao-periodo"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={formik.values.status} onValueChange={(v) => formik.setFieldValue('status', v)}>
                <SelectTrigger className="h-9 text-sm" data-testid="comissao-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={closeDialog}>Cancelar</Button>
              <Button type="submit" size="sm" data-testid="comissao-submit-btn">
                {editItem ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
