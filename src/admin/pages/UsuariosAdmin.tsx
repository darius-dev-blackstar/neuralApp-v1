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
import { ModalUsuario } from "../components/ModalUsuario";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  ultimoAcceso: string;
}

export default function UsuariosAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  const usuarios: Usuario[] = [
    {
      id: "1",
      nombre: "Admin Principal",
      email: "admin@neuralapp.com",
      rol: "admin",
      activo: true,
      ultimoAcceso: "Hace 5 min"
    },
    {
      id: "2",
      nombre: "María López",
      email: "mlopez@neuralapp.com",
      rol: "operador",
      activo: true,
      ultimoAcceso: "Hace 2 horas"
    },
    {
      id: "3",
      nombre: "Carlos Martínez",
      email: "cmartinez@neuralapp.com",
      rol: "operador",
      activo: false,
      ultimoAcceso: "Hace 3 días"
    }
  ];

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Usuarios del Panel</h1>
          <p className="text-muted-foreground mt-1">Gestiona administradores y operadores</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
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
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Último Acceso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Badge variant={usuario.rol === "admin" ? "default" : "secondary"}>
                    {usuario.rol === "admin" ? "Administrador" : "Operador"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{usuario.ultimoAcceso}</TableCell>
                <TableCell>
                  <Badge variant={usuario.activo ? "default" : "secondary"}>
                    {usuario.activo ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => handleEdit(usuario)}>
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

      <ModalUsuario
        open={modalOpen}
        onOpenChange={setModalOpen}
        usuario={selectedUsuario}
      />
    </div>
  );
}
