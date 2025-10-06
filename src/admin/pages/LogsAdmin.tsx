import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Log {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  accion: string;
  detalle: string;
  tipo: "create" | "update" | "delete" | "view";
}

export default function LogsAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");

  const logs: Log[] = [
    {
      id: "1",
      fecha: "2024-10-06",
      hora: "14:32",
      usuario: "Admin Principal",
      accion: "Creó consultorio",
      detalle: "Clínica San Rafael",
      tipo: "create"
    },
    {
      id: "2",
      fecha: "2024-10-06",
      hora: "13:15",
      usuario: "María López",
      accion: "Actualizó médico",
      detalle: "Dr. Juan Pérez - Cambió especialidad",
      tipo: "update"
    },
    {
      id: "3",
      fecha: "2024-10-06",
      hora: "11:45",
      usuario: "Admin Principal",
      accion: "Eliminó usuario",
      detalle: "operador@test.com",
      tipo: "delete"
    },
    {
      id: "4",
      fecha: "2024-10-06",
      hora: "10:20",
      usuario: "Carlos Martínez",
      accion: "Consultó logs",
      detalle: "Filtró por fecha 2024-10-05",
      tipo: "view"
    },
    {
      id: "5",
      fecha: "2024-10-05",
      hora: "16:50",
      usuario: "María López",
      accion: "Creó médico",
      detalle: "Dra. María González",
      tipo: "create"
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === "all" || log.tipo === filterTipo;
    
    return matchesSearch && matchesTipo;
  });

  const getTipoBadge = (tipo: Log["tipo"]) => {
    const variants = {
      create: { variant: "default" as const, label: "Crear" },
      update: { variant: "secondary" as const, label: "Editar" },
      delete: { variant: "destructive" as const, label: "Eliminar" },
      view: { variant: "outline" as const, label: "Ver" }
    };
    return variants[tipo];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Logs de Actividad</h1>
          <p className="text-muted-foreground mt-1">Auditoría completa del sistema</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="create">Crear</SelectItem>
            <SelectItem value="update">Editar</SelectItem>
            <SelectItem value="delete">Eliminar</SelectItem>
            <SelectItem value="view">Ver</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card shadow-apple">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Detalle</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => {
              const badge = getTipoBadge(log.tipo);
              return (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.fecha}</TableCell>
                  <TableCell>{log.hora}</TableCell>
                  <TableCell>{log.usuario}</TableCell>
                  <TableCell>{log.accion}</TableCell>
                  <TableCell className="text-muted-foreground">{log.detalle}</TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
