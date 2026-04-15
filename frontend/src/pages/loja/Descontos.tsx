import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Tag, Calendar } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { descontos as mockData } from "@/api/mockData";
import type { Desconto } from "@/types/loja";

const validationSchema = Yup.object({
  nome: Yup.string().required("Nome obrigatorio"),
  tipo: Yup.string()
    .oneOf(["percentual", "valor_fixo"])
    .required("Tipo obrigatorio"),
  valor: Yup.number()
    .min(0, "Valor deve ser positivo")
    .required("Valor obrigatorio"),
  aplicacao: Yup.string()
    .oneOf(["produto", "categoria", "geral"])
    .required("Aplicação obrigatoria"),
  validoDe: Yup.string().required("Data inicio obrigatoria"),
  validoAte: Yup.string().required("Data fim obrigatoria"),
  status: Yup.string()
    .oneOf(["ativo", "inativo"])
    .required("Status obrigatorio"),
});

const statusStyles: Record<string, string> = {
  ativo: "bg-emerald-500 hover:bg-emerald-600",
  inativo: "bg-gray-400 hover:bg-gray-500",
  expirado: "bg-red-400 hover:bg-red-500",
};

export default function Descontos() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Desconto | null>(null);

  const { data: descontos = [] } = useQuery({
    queryKey: ["descontos"],
    queryFn: () => Promise.resolve(mockData),
  });

  const mutation = useMutation({
    mutationFn: (values: Partial<Desconto>) => Promise.resolve(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["descontos"] });
      toast.success(editItem ? "Desconto atualizado!" : "Desconto criado!");
      closeDialog();
    },
  });

  const formik = useFormik({
    initialValues: {
      nome: "",
      tipo: "percentual" as const,
      valor: 0,
      aplicacao: "geral" as const,
      validoDe: "",
      validoAte: "",
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
  const openEdit = (item: Desconto) => {
    setEditItem(item);
    formik.setValues({
      nome: item.nome,
      tipo: item.tipo,
      valor: item.valor,
      aplicacao: item.aplicacao,
      validoDe: item.validoDe,
      validoAte: item.validoAte,
      status: item.status === "expirado" ? "inativo" : item.status,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
    formik.resetForm();
  };

  const filtered = descontos.filter((d) =>
    d.nome.toLowerCase().includes(search.toLowerCase()),
  );
  const totalAtivos = descontos.filter((d) => d.status === "ativo").length;

  return (
    <div className="space-y-4" data-testid="descontos-page">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Descontos</p>
              <p className="text-lg font-bold font-display">
                {descontos.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ativos</p>
              <p className="text-lg font-bold font-display">{totalAtivos}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expirados</p>
              <p className="text-lg font-bold font-display">
                {descontos.filter((d) => d.status === "expirado").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">
              Descontos
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar desconto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs"
                  data-testid="descontos-search"
                />
              </div>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={openCreate}
                data-testid="descontos-add-btn"
              >
                <Plus className="w-3.5 h-3.5" /> Novo Desconto
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
                <TableHead className="text-xs">Valor</TableHead>
                <TableHead className="text-xs">Aplicação</TableHead>
                <TableHead className="text-xs">Validade</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} data-testid={`desconto-row-${item.id}`}>
                  <TableCell className="text-sm font-medium">
                    {item.nome}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {item.tipo.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.tipo === "percentual"
                      ? `${item.valor}%`
                      : `R$ ${item.valor.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {item.aplicacao}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.validoDe} a {item.validoAte}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] text-white ${statusStyles[item.status] || ""}`}
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
                        data-testid={`edit-desconto-${item.id}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-testid={`delete-desconto-${item.id}`}
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
        <DialogContent className="sm:max-w-md" data-testid="desconto-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {editItem ? "Editar Desconto" : "Novo Desconto"}
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
                placeholder="Nome do desconto"
                className={`h-9 text-sm ${formik.touched.nome && formik.errors.nome ? "border-destructive" : ""}`}
                data-testid="desconto-nome"
              />
              {formik.touched.nome && formik.errors.nome && (
                <p className="text-[11px] text-destructive">
                  {formik.errors.nome}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tipo</Label>
                <Select
                  value={formik.values.tipo}
                  onValueChange={(v) => formik.setFieldValue("tipo", v)}
                >
                  <SelectTrigger
                    className="h-9 text-sm"
                    data-testid="desconto-tipo"
                  >
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
                  className={`h-9 text-sm ${formik.touched.valor && formik.errors.valor ? "border-destructive" : ""}`}
                  data-testid="desconto-valor"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Aplicação</Label>
              <Select
                value={formik.values.aplicacao}
                onValueChange={(v) => formik.setFieldValue("aplicacao", v)}
              >
                <SelectTrigger
                  className="h-9 text-sm"
                  data-testid="desconto-aplicacao"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="categoria">Categoria</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Valido De</Label>
                <Input
                  name="validoDe"
                  type="date"
                  value={formik.values.validoDe}
                  onChange={formik.handleChange}
                  className="h-9 text-sm"
                  data-testid="desconto-valido-de"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Valido Ate</Label>
                <Input
                  name="validoAte"
                  type="date"
                  value={formik.values.validoAte}
                  onChange={formik.handleChange}
                  className="h-9 text-sm"
                  data-testid="desconto-valido-ate"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(v) => formik.setFieldValue("status", v)}
              >
                <SelectTrigger
                  className="h-9 text-sm"
                  data-testid="desconto-status"
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
              <Button type="submit" size="sm" data-testid="desconto-submit-btn">
                {editItem ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
