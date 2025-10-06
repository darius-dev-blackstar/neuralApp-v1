import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ModalConsultorio } from "../components/ModalConsultorio";

interface Consultorio {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  plan: string;
  activo: boolean;
}

export default function Consultorios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConsultorio, setSelectedConsultorio] = useState<Consultorio | null>(null);

  const consultorios: Consultorio[] = [
    {
      id: "1",
      nombre: "Clínica San Rafael",
      direccion: "Av. Libertador 1234",
      telefono: "+54 11 4567-8900",
      email: "contacto@sanrafael.com",
      plan: "Enterprise",
      activo: true
    },
    {
      id: "2",
      nombre: "Consultorio Dr. Pérez",
      direccion: "Calle Falsa 123",
      telefono: "+54 11 4567-8901",
      email: "info@drperez.com",
      plan: "Professional",
      activo: true
    },
    {
      id: "3",
      nombre: "Centro Médico Norte",
      direccion: "Av. del Campo 456",
      telefono: "+54 11 4567-8902",
      email: "info@centronorte.com",
      plan: "Básico",
      activo: false
    }
  ];

  const filteredConsultorios = consultorios.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (consultorio: Consultorio) => {
    setSelectedConsultorio(consultorio);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedConsultorio(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Consultorios</h1>
          <p className="text-muted-foreground mt-1">Gestiona consultorios y clínicas</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Consultorio
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-apple">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsultorios.map((consultorio) => (
              <TableRow key={consultorio.id}>
                <TableCell className="font-medium">{consultorio.nombre}</TableCell>
                <TableCell>{consultorio.direccion}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{consultorio.email}</div>
                    <div className="text-muted-foreground">{consultorio.telefono}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{consultorio.plan}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={consultorio.activo ? "default" : "secondary"}>
                    {consultorio.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(consultorio)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ModalConsultorio
        open={modalOpen}
        onOpenChange={setModalOpen}
        consultorio={selectedConsultorio}
      />
    </div>
  );
}
