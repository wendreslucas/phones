import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Layers,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { gruposContas as mockData } from "@/api/mockData";
import type { GrupoContas } from "@/types/cadastro";

const validationSchema = Yup.object({
  nome: Yup.string().required("Nome obrigatorio"),
  tipo: Yup.string().oneOf(["receita", "despesa"]).required("Tipo obrigatorio"),
  descricao: Yup.string().required("Descricao obrigatoria"),
  status: Yup.string()
    .oneOf(["ativo", "inativo"])
    .required("Status obrigatorio"),
});

export default function GrupoContasPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<GrupoContas | null>(null);

  const { data: grupos = [] } = useQuery({
    queryKey: ["grupos-contas"],
    queryFn: () => Promise.resolve(mockData),
  });

  const mutation = useMutation({
    mutationFn: (values: Partial<GrupoContas>) => Promise.resolve(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos-contas"] });
      toast.success(editItem ? "Grupo atualizado!" : "Grupo criado!");
      closeDialog();
    },
  });

  const formik = useFormik({
    initialValues: {
      nome: "",
      tipo: "receita" as "receita" | "despesa",
      descricao: "",
      status: "ativo" as "ativo" | "inativo",
    },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
  });

  const openCreate = () => {
    setEditItem(null);
    formik.resetForm();
    setDialogOpen(true);
  };
  const openEdit = (item: GrupoContas) => {
    setEditItem(item);
    formik.setValues({
      nome: item.nome,
      tipo: item.tipo,
      descricao: item.descricao,
      status: item.status,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
    formik.resetForm();
  };

  const filtered = grupos.filter((g) =>
    g.nome.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4" data-testid="grupo-contas-page">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Grupos</p>
              <p className="text-lg font-bold font-display">{grupos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Receita</p>
              <p className="text-lg font-bold font-display">
                {grupos.filter((g) => g.tipo === "receita").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Despesa</p>
              <p className="text-lg font-bold font-display">
                {grupos.filter((g) => g.tipo === "despesa").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">
              Grupo de Contas
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar grupo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs"
                  data-testid="grupo-contas-search"
                />
              </div>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={openCreate}
                data-testid="grupo-contas-add-btn"
              >
                <Plus className="w-3.5 h-3.5" /> Novo Grupo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nome</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Descricao</TableHead>
                <TableHead className="text-xs">Contas Vinculadas</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.id}
                  data-testid={`grupo-contas-row-${item.id}`}
                >
                  <TableCell className="text-sm font-medium">
                    {item.nome}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${item.tipo === "receita" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-400 hover:bg-red-500"} text-white`}
                    >
                      {item.tipo === "receita" ? "Receita" : "Despesa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {item.descricao}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.contasVinculadas}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "ativo" ? "default" : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEdit(item)}
                        data-testid={`edit-grupo-contas-${item.id}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-testid={`delete-grupo-contas-${item.id}`}
                      >
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          data-testid="grupo-contas-dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {editItem ? "Editar Grupo" : "Novo Grupo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome</Label>
              <Input
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nome do grupo"
                className={`h-9 text-sm ${formik.touched.nome && formik.errors.nome ? "border-destructive" : ""}`}
                data-testid="grupo-contas-nome"
              />
              {formik.touched.nome && formik.errors.nome && (
                <p className="text-[11px] text-destructive">
                  {formik.errors.nome}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo</Label>
              <Select
                value={formik.values.tipo}
                onValueChange={(v) => formik.setFieldValue("tipo", v)}
              >
                <SelectTrigger
                  className="h-9 text-sm"
                  data-testid="grupo-contas-tipo"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descricao</Label>
              <Textarea
                name="descricao"
                value={formik.values.descricao}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Descricao do grupo"
                className={`text-sm min-h-[60px] ${formik.touched.descricao && formik.errors.descricao ? "border-destructive" : ""}`}
                data-testid="grupo-contas-descricao"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(v) => formik.setFieldValue("status", v)}
              >
                <SelectTrigger
                  className="h-9 text-sm"
                  data-testid="grupo-contas-status"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeDialog}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                data-testid="grupo-contas-submit-btn"
              >
                {editItem ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
