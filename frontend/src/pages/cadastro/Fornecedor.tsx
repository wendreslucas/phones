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
  Truck,
  Building2,
  MapPin,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fornecedores as mockData } from "@/api/mockData";
import type { Fornecedor } from "@/types/cadastro";

const validationSchema = Yup.object({
  razaoSocial: Yup.string().required("Razao social obrigatoria"),
  nomeFantasia: Yup.string().required("Nome fantasia obrigatorio"),
  cnpj: Yup.string().required("CNPJ obrigatorio"),
  email: Yup.string().email("Email invalido").required("Email obrigatorio"),
  telefone: Yup.string().required("Telefone obrigatorio"),
  cidade: Yup.string().required("Cidade obrigatoria"),
  uf: Yup.string()
    .length(2, "UF deve ter 2 caracteres")
    .required("UF obrigatoria"),
  status: Yup.string()
    .oneOf(["ativo", "inativo"])
    .required("Status obrigatorio"),
});

export default function FornecedorPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Fornecedor | null>(null);

  const { data: fornecedores = [] } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: () => Promise.resolve(mockData),
  });

  const mutation = useMutation({
    mutationFn: (values: Partial<Fornecedor>) => Promise.resolve(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast.success(editItem ? "Fornecedor atualizado!" : "Fornecedor criado!");
      closeDialog();
    },
  });

  const formik = useFormik({
    initialValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      email: "",
      telefone: "",
      cidade: "",
      uf: "",
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
  const openEdit = (item: Fornecedor) => {
    setEditItem(item);
    formik.setValues({
      razaoSocial: item.razaoSocial,
      nomeFantasia: item.nomeFantasia,
      cnpj: item.cnpj,
      email: item.email,
      telefone: item.telefone,
      cidade: item.cidade,
      uf: item.uf,
      status: item.status,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
    formik.resetForm();
  };

  const filtered = fornecedores.filter(
    (f) =>
      f.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
      f.cnpj.includes(search),
  );

  return (
    <div className="space-y-4" data-testid="fornecedor-page">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Total Fornecedores
              </p>
              <p className="text-lg font-bold font-display">
                {fornecedores.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ativos</p>
              <p className="text-lg font-bold font-display">
                {fornecedores.filter((f) => f.status === "ativo").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estados</p>
              <p className="text-lg font-bold font-display">
                {new Set(fornecedores.map((f) => f.uf)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">
              Fornecedores
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedor ou CNPJ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-52 pl-8 text-xs"
                  data-testid="fornecedor-search"
                />
              </div>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={openCreate}
                data-testid="fornecedor-add-btn"
              >
                <Plus className="w-3.5 h-3.5" /> Novo Fornecedor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nome Fantasia</TableHead>
                <TableHead className="text-xs">CNPJ</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Telefone</TableHead>
                <TableHead className="text-xs">Cidade/UF</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.id}
                  data-testid={`fornecedor-row-${item.id}`}
                >
                  <TableCell className="text-sm font-medium">
                    {item.nomeFantasia}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-xs">
                    {item.cnpj}
                  </TableCell>
                  <TableCell className="text-sm">{item.email}</TableCell>
                  <TableCell className="text-sm">{item.telefone}</TableCell>
                  <TableCell className="text-sm">
                    {item.cidade}/{item.uf}
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
                        data-testid={`edit-fornecedor-${item.id}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-testid={`delete-fornecedor-${item.id}`}
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
        <DialogContent className="sm:max-w-lg" data-testid="fornecedor-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {editItem ? "Editar Fornecedor" : "Novo Fornecedor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Razao Social</Label>
              <Input
                name="razaoSocial"
                value={formik.values.razaoSocial}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-9 text-sm ${formik.touched.razaoSocial && formik.errors.razaoSocial ? "border-destructive" : ""}`}
                data-testid="fornecedor-razao"
              />
              {formik.touched.razaoSocial && formik.errors.razaoSocial && (
                <p className="text-[11px] text-destructive">
                  {formik.errors.razaoSocial}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nome Fantasia</Label>
                <Input
                  name="nomeFantasia"
                  value={formik.values.nomeFantasia}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.nomeFantasia && formik.errors.nomeFantasia ? "border-destructive" : ""}`}
                  data-testid="fornecedor-fantasia"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">CNPJ</Label>
                <Input
                  name="cnpj"
                  value={formik.values.cnpj}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="00.000.000/0001-00"
                  className={`h-9 text-sm ${formik.touched.cnpj && formik.errors.cnpj ? "border-destructive" : ""}`}
                  data-testid="fornecedor-cnpj"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.email && formik.errors.email ? "border-destructive" : ""}`}
                  data-testid="fornecedor-email"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Telefone</Label>
                <Input
                  name="telefone"
                  value={formik.values.telefone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="(00) 0000-0000"
                  className={`h-9 text-sm ${formik.touched.telefone && formik.errors.telefone ? "border-destructive" : ""}`}
                  data-testid="fornecedor-telefone"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-1">
                <Label className="text-xs">Cidade</Label>
                <Input
                  name="cidade"
                  value={formik.values.cidade}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.cidade && formik.errors.cidade ? "border-destructive" : ""}`}
                  data-testid="fornecedor-cidade"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">UF</Label>
                <Input
                  name="uf"
                  value={formik.values.uf}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={2}
                  className={`h-9 text-sm uppercase ${formik.touched.uf && formik.errors.uf ? "border-destructive" : ""}`}
                  data-testid="fornecedor-uf"
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
                    data-testid="fornecedor-status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                data-testid="fornecedor-submit-btn"
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
