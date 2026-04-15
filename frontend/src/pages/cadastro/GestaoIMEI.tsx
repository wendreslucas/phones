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
  Smartphone,
  CheckCircle,
  AlertCircle,
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
import { imeis as mockData } from "@/api/mockData";
import type { IMEI } from "@/types/cadastro";

const validationSchema = Yup.object({
  numero: Yup.string()
    .length(15, "IMEI deve ter 15 digitos")
    .required("IMEI obrigatorio"),
  produto: Yup.string().required("Produto obrigatorio"),
  modelo: Yup.string().required("Modelo obrigatorio"),
  status: Yup.string().required("Status obrigatorio"),
  fornecedor: Yup.string().required("Fornecedor obrigatorio"),
  nfe: Yup.string().required("NFe obrigatoria"),
});

const statusStyles: Record<string, { style: string; label: string }> = {
  disponivel: {
    style: "bg-emerald-500 hover:bg-emerald-600 text-white",
    label: "Disponivel",
  },
  vendido: {
    style: "bg-primary hover:bg-primary/90 text-white",
    label: "Vendido",
  },
  reservado: {
    style: "bg-amber-500 hover:bg-amber-600 text-white",
    label: "Reservado",
  },
  defeito: {
    style: "bg-red-400 hover:bg-red-500 text-white",
    label: "Defeito",
  },
};

export default function GestaoIMEI() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<IMEI | null>(null);

  const { data: imeis = [] } = useQuery({
    queryKey: ["imeis"],
    queryFn: () => Promise.resolve(mockData),
  });

  const mutation = useMutation({
    mutationFn: (values: Partial<IMEI>) => Promise.resolve(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imeis"] });
      toast.success(editItem ? "IMEI atualizado!" : "IMEI cadastrado!");
      closeDialog();
    },
  });

  const formik = useFormik({
    initialValues: {
      numero: "",
      produto: "",
      modelo: "",
      status: "disponivel" as string,
      fornecedor: "",
      nfe: "",
    },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
  });

  const openCreate = () => {
    setEditItem(null);
    formik.resetForm();
    setDialogOpen(true);
  };
  const openEdit = (item: IMEI) => {
    setEditItem(item);
    formik.setValues({
      numero: item.numero,
      produto: item.produto,
      modelo: item.modelo,
      status: item.status,
      fornecedor: item.fornecedor,
      nfe: item.nfe,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
    formik.resetForm();
  };

  const filtered = imeis.filter((i) => {
    const matchSearch =
      i.numero.includes(search) ||
      i.produto.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4" data-testid="gestao-imei-page">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusStyles).map(([key, cfg]) => (
          <Card key={key} className="card-hover">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                {key === "disponivel" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : key === "defeito" ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Smartphone className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground capitalize">
                  {cfg.label}
                </p>
                <p className="text-lg font-bold font-display">
                  {imeis.filter((i) => i.status === key).length}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">
              Gestao IMEI
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar IMEI ou produto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-52 pl-8 text-xs"
                  data-testid="imei-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="h-8 w-36 text-xs"
                  data-testid="imei-filter-status"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="disponivel">Disponivel</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="defeito">Defeito</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={openCreate}
                data-testid="imei-add-btn"
              >
                <Plus className="w-3.5 h-3.5" /> Novo IMEI
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">IMEI</TableHead>
                <TableHead className="text-xs">Produto</TableHead>
                <TableHead className="text-xs">Modelo</TableHead>
                <TableHead className="text-xs">Fornecedor</TableHead>
                <TableHead className="text-xs">NFe</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} data-testid={`imei-row-${item.id}`}>
                  <TableCell className="text-sm font-mono">
                    {item.numero}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {item.produto}
                  </TableCell>
                  <TableCell className="text-sm">{item.modelo}</TableCell>
                  <TableCell className="text-sm">{item.fornecedor}</TableCell>
                  <TableCell className="text-sm">{item.nfe}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${statusStyles[item.status]?.style || ""}`}
                    >
                      {statusStyles[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEdit(item)}
                        data-testid={`edit-imei-${item.id}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-testid={`delete-imei-${item.id}`}
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
        <DialogContent className="sm:max-w-md" data-testid="imei-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {editItem ? "Editar IMEI" : "Cadastrar IMEI"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Numero IMEI</Label>
              <Input
                name="numero"
                value={formik.values.numero}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="353456789012345"
                maxLength={15}
                className={`h-9 text-sm font-mono ${formik.touched.numero && formik.errors.numero ? "border-destructive" : ""}`}
                data-testid="imei-numero"
              />
              {formik.touched.numero && formik.errors.numero && (
                <p className="text-[11px] text-destructive">
                  {formik.errors.numero}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Produto</Label>
                <Input
                  name="produto"
                  value={formik.values.produto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.produto && formik.errors.produto ? "border-destructive" : ""}`}
                  data-testid="imei-produto"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Modelo</Label>
                <Input
                  name="modelo"
                  value={formik.values.modelo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.modelo && formik.errors.modelo ? "border-destructive" : ""}`}
                  data-testid="imei-modelo"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Fornecedor</Label>
                <Input
                  name="fornecedor"
                  value={formik.values.fornecedor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.fornecedor && formik.errors.fornecedor ? "border-destructive" : ""}`}
                  data-testid="imei-fornecedor"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">NFe</Label>
                <Input
                  name="nfe"
                  value={formik.values.nfe}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-9 text-sm ${formik.touched.nfe && formik.errors.nfe ? "border-destructive" : ""}`}
                  data-testid="imei-nfe"
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
                  data-testid="imei-status"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponivel</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="defeito">Defeito</SelectItem>
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
              <Button type="submit" size="sm" data-testid="imei-submit-btn">
                {editItem ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
