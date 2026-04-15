import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Target, TrendingUp, TrendingDown, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { metasVenda as mockData } from "@/api/mockData";

const statusConfig: Record<string, { label: string; style: string }> = {
  atingida: {
    label: "Atingida",
    style: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  em_andamento: {
    label: "Em Andamento",
    style: "bg-primary hover:bg-primary/90 text-white",
  },
  nao_atingida: {
    label: "Nao Atingida",
    style: "bg-red-400 hover:bg-red-500 text-white",
  },
};

export default function MetasVenda() {
  const [search, setSearch] = useState("");

  const { data: metas = [] } = useQuery({
    queryKey: ["metas-venda"],
    queryFn: () => Promise.resolve(mockData),
  });

  const filtered = metas.filter((m) =>
    m.vendedor.toLowerCase().includes(search.toLowerCase()),
  );
  const totalMeta = metas.reduce((a, m) => a + m.metaValor, 0);
  const totalRealizado = metas.reduce((a, m) => a + m.realizado, 0);
  const atingidas = metas.filter((m) => m.status === "atingida").length;

  return (
    <div className="space-y-4" data-testid="metas-venda-page">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Meta Total</p>
              <p className="text-lg font-bold font-display">
                R$ {(totalMeta / 1000).toFixed(0)}k
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Realizado</p>
              <p className="text-lg font-bold font-display">
                R$ {(totalRealizado / 1000).toFixed(0)}k
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Metas Atingidas</p>
              <p className="text-lg font-bold font-display">
                {atingidas}/{metas.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">% Global</p>
              <p className="text-lg font-bold font-display">
                {totalMeta > 0
                  ? ((totalRealizado / totalMeta) * 100).toFixed(1)
                  : 0}
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
              Metas de Venda
            </CardTitle>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar vendedor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-48 pl-8 text-xs"
                data-testid="metas-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Vendedor</TableHead>
                <TableHead className="text-xs">Período</TableHead>
                <TableHead className="text-xs">Meta</TableHead>
                <TableHead className="text-xs">Realizado</TableHead>
                <TableHead className="text-xs w-32">Progresso</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const cfg = statusConfig[item.status];
                return (
                  <TableRow key={item.id} data-testid={`meta-row-${item.id}`}>
                    <TableCell className="text-sm font-medium">
                      {item.vendedor}
                    </TableCell>
                    <TableCell className="text-sm">{item.periodo}</TableCell>
                    <TableCell className="text-sm">
                      R$ {item.metaValor.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-sm">
                      R$ {item.realizado.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(item.percentual, 100)}
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs font-medium w-12 text-right">
                          {item.percentual}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${cfg?.style || ""}`}>
                        {cfg?.label || item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
