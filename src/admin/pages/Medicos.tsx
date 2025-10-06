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
import { ModalMedico } from "../components/ModalMedico";

interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  consultorio: string;
  credenciales: string;
  activo: boolean;
}

export default function Medicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);

  const medicos: Medico[] = [
    {
      id: "1",
      nombre: "Dr. Juan Pérez",
      especialidad: "Cardiología",
      email: "jperez@email.com",
      telefono: "+54 11 4567-8900",
      consultorio: "Clínica San Rafael",
      credenciales: "MN 12345",
      activo: true
    },
    {
      id: "2",
      nombre: "Dra. María González",
      especialidad: "Pediatría",
      email: "mgonzalez@email.com",
      telefono: "+54 11 4567-8901",
      consultorio: "Centro Médico Norte",
      credenciales: "MN 67890",
      activo: true
    },
    {
      id: "3",
      nombre: "Dr. Carlos Rodríguez",
      especialidad: "Neurología",
      email: "crodriguez@email.com",
      telefono: "+54 11 4567-8902",
      consultorio: "Consultorio Dr. Pérez",
      credenciales: "MN 11223",
      activo: false
    }
  ];

  const filteredMedicos = medicos.filter(m =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (medico: Medico) => {
    setSelectedMedico(medico);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedMedico(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Médicos</h1>
          <p className="text-muted-foreground mt-1">Gestiona médicos del sistema</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Médico
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, especialidad o email..."
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
              <TableHead>Especialidad</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Consultorio</TableHead>
              <TableHead>Credenciales</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicos.map((medico) => (
              <TableRow key={medico.id}>
                <TableCell className="font-medium">{medico.nombre}</TableCell>
                <TableCell>{medico.especialidad}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{medico.email}</div>
                    <div className="text-muted-foreground">{medico.telefono}</div>
                  </div>
                </TableCell>
                <TableCell>{medico.consultorio}</TableCell>
                <TableCell>
                  <Badge variant="outline">{medico.credenciales}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={medico.activo ? "default" : "secondary"}>
                    {medico.activo ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => handleEdit(medico)}>
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

      <ModalMedico
        open={modalOpen}
        onOpenChange={setModalOpen}
        medico={selectedMedico}
      />
    </div>
  );
}
