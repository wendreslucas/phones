import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { Plus, Search, Pencil, Trash2, Shield, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { gruposPermissao as mockData } from '@/api/mockData'
import type { GrupoPermissao } from '@/types/cadastro'

const allPermissions = ['loja', 'cadastro', 'estoque', 'financeiro', 'relatorios', 'configuracoes']

const validationSchema = Yup.object({
  nome: Yup.string().required('Nome obrigatorio'),
  descricao: Yup.string().required('Descricao obrigatoria'),
  permissoes: Yup.array().of(Yup.string()).min(1, 'Selecione ao menos uma permissao'),
})

export default function GrupoPermissaoPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<GrupoPermissao | null>(null)

  const { data: grupos = [] } = useQuery({ queryKey: ['grupos-permissao'], queryFn: () => Promise.resolve(mockData) })

  const mutation = useMutation({
    mutationFn: (values: Partial<GrupoPermissao>) => Promise.resolve(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['grupos-permissao'] }); toast.success(editItem ? 'Grupo atualizado!' : 'Grupo criado!'); closeDialog() },
  })

  const formik = useFormik({
    initialValues: { nome: '', descricao: '', permissoes: [] as string[] },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
  })

  const openCreate = () => { setEditItem(null); formik.resetForm(); setDialogOpen(true) }
  const openEdit = (item: GrupoPermissao) => { setEditItem(item); formik.setValues({ nome: item.nome, descricao: item.descricao, permissoes: item.permissoes }); setDialogOpen(true) }
  const closeDialog = () => { setDialogOpen(false); setEditItem(null); formik.resetForm() }

  const togglePermission = (perm: string) => {
    const current = formik.values.permissoes
    formik.setFieldValue('permissoes', current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm])
  }

  const filtered = grupos.filter((g) => g.nome.toLowerCase().includes(search.toLowerCase()))
  const totalUsuarios = grupos.reduce((a, g) => a + g.usuarios, 0)

  return (
    <div className="space-y-4" data-testid="grupo-permissao-page">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Total Grupos</p><p className="text-lg font-bold font-display">{grupos.length}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Users className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Usuarios</p><p className="text-lg font-bold font-display">{totalUsuarios}</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Shield className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs text-muted-foreground">Permissoes</p><p className="text-lg font-bold font-display">{allPermissions.length}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">Grupos de Permissao</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar grupo..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-48 pl-8 text-xs" data-testid="grupo-permissao-search" />
              </div>
              <Button size="sm" className="h-8 text-xs gap-1.5" onClick={openCreate} data-testid="grupo-permissao-add-btn"><Plus className="w-3.5 h-3.5" /> Novo Grupo</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nome</TableHead>
                <TableHead className="text-xs">Descricao</TableHead>
                <TableHead className="text-xs">Permissoes</TableHead>
                <TableHead className="text-xs">Usuarios</TableHead>
                <TableHead className="text-xs w-20">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} data-testid={`grupo-permissao-row-${item.id}`}>
                  <TableCell className="text-sm font-medium">{item.nome}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.descricao}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.permissoes.map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px] capitalize">{p}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.usuarios}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)} data-testid={`edit-grupo-permissao-${item.id}`}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" data-testid={`delete-grupo-permissao-${item.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="grupo-permissao-dialog">
          <DialogHeader><DialogTitle className="font-display text-base">{editItem ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle></DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome</Label>
              <Input name="nome" value={formik.values.nome} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Nome do grupo" className={`h-9 text-sm ${formik.touched.nome && formik.errors.nome ? 'border-destructive' : ''}`} data-testid="grupo-permissao-nome" />
              {formik.touched.nome && formik.errors.nome && <p className="text-[11px] text-destructive">{formik.errors.nome}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descricao</Label>
              <Input name="descricao" value={formik.values.descricao} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Descricao do grupo" className={`h-9 text-sm ${formik.touched.descricao && formik.errors.descricao ? 'border-destructive' : ''}`} data-testid="grupo-permissao-descricao" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Permissoes</Label>
              <div className="grid grid-cols-2 gap-2">
                {allPermissions.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 p-2 rounded-md border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                    <Checkbox checked={formik.values.permissoes.includes(perm)} onCheckedChange={() => togglePermission(perm)} data-testid={`perm-${perm}`} />
                    <span className="text-xs capitalize">{perm}</span>
                  </label>
                ))}
              </div>
              {formik.touched.permissoes && formik.errors.permissoes && <p className="text-[11px] text-destructive">{formik.errors.permissoes as string}</p>}
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={closeDialog}>Cancelar</Button>
              <Button type="submit" size="sm" data-testid="grupo-permissao-submit-btn">{editItem ? 'Atualizar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
