import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, CreditCard } from "lucide-react";
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
import { cartoes as mockData } from "@/api/mockData";
import type { Cartao } from "@/types/cadastro";

const validationSchema = Yup.object({
  bandeira: Yup.string().required("Bandeira obrigatoria"),
  tipo: Yup.string()
    .oneOf(["credito", "debito", "voucher"])
    .required("Tipo obrigatorio"),
  taxaPercentual: Yup.number().min(0).max(100).required("Taxa obrigatoria"),
  diasRecebimento: Yup.number().min(0).required("Dias obrigatorio"),
  status: Yup.string()
    .oneOf(["ativo", "inativo"])
    .required("Status obrigatorio"),
});

export default function CartaoPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Cartao | null>(null);

  const { data: cartoes = [] } = useQuery({
    queryKey: ["cartoes"],
    queryFn: () => Promise.resolve(mockData),
  });

  const mutation = useMutation({
    mutationFn: (values: Partial<Cartao>) => Promise.resolve(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartoes"] });
      toast.success(editItem ? "Cartao atualizado!" : "Cartao criado!");
      closeDialog();
    },
  });

  const formik = useFormik({
    initialValues: {
      bandeira: "",
      tipo: "credito" as string,
      taxaPercentual: 0,
      diasRecebimento: 0,
      status: "ativo" as string,
    },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
  });

  const openCreate = () => {
    setEditItem(null);
    formik.resetForm();
    setDialogOpen(true);
  };
  const openEdit = (item: Cartao) => {
    setEditItem(item);
    formik.setValues({
      bandeira: item.bandeira,
      tipo: item.tipo,
      taxaPercentual: item.taxaPercentual,
      diasRecebimento: item.diasRecebimento,
      status: item.status,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
    formik.resetForm();
  };

  const filtered = cartoes.filter((c) =>
    c.bandeira.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4" data-testid="cartao-page">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Cartoes</p>
              <p className="text-lg font-bold font-display">{cartoes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ativos</p>
              <p className="text-lg font-bold font-display">
                {cartoes.filter((c) => c.status === "ativo").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Taxa Media</p>
              <p className="text-lg font-bold font-display">
                {(
                  cartoes.reduce((a, c) => a + c.taxaPercentual, 0) /
                    cartoes.length || 0
                ).toFixed(2)}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold font-display">
              Cartoes
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar bandeira..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs"
                  data-testid="cartao-search"
                />
              </div>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={openCreate}
                data-testid="cartao-add-btn"
              >
                <Plus className="w-3.5 h-3.5" /> Novo Cartao
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Bandeira</TableHead>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Taxa (%)</TableHead>
                <TableHead className="text-xs">Dias Recebimento</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} data-testid={`cartao-row-${item.id}`}>
                  <TableCell className="text-sm font-medium">
                    {item.bandeira}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {item.tipo}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.taxaPercentual}%
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.diasRecebimento}{" "}
                    {item.diasRecebimento === 1 ? "dia" : "dias"}
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
                        data-testid={`edit-cartao-${item.id}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-testid={`delete-cartao-${item.id}`}
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
        <DialogContent className="sm:max-w-md" data-testid="cartao-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {editItem ? "Editar Cartao" : "Novo Cartao"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Bandeira</Label>
              <Input
                name="bandeira"
                value={formik.values.bandeira}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ex: Visa, Mastercard"
                className={`h-9 text-sm ${formik.touched.bandeira && formik.errors.bandeira ? "border-destructive" : ""}`}
                data-testid="cartao-bandeira"
              />
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
                    data-testid="cartao-tipo"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credito">Credito</SelectItem>
                    <SelectItem value="debito">Debito</SelectItem>
                    <SelectItem value="voucher">Voucher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Taxa (%)</Label>
                <Input
                  name="taxaPercentual"
                  type="number"
                  step="0.01"
                  value={formik.values.taxaPercentual}
                  onChange={formik.handleChange}
                  className="h-9 text-sm"
                  data-testid="cartao-taxa"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Dias Recebimento</Label>
                <Input
                  name="diasRecebimento"
                  type="number"
                  value={formik.values.diasRecebimento}
                  onChange={formik.handleChange}
                  className="h-9 text-sm"
                  data-testid="cartao-dias"
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
                    data-testid="cartao-status"
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
              <Button type="submit" size="sm" data-testid="cartao-submit-btn">
                {editItem ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
