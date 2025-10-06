import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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

interface ModalMedicoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medico: Medico | null;
}

export function ModalMedico({ open, onOpenChange, medico }: ModalMedicoProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    email: "",
    telefono: "",
    consultorio: "",
    credenciales: "",
    activo: true,
  });

  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre,
        especialidad: medico.especialidad,
        email: medico.email,
        telefono: medico.telefono,
        consultorio: medico.consultorio,
        credenciales: medico.credenciales,
        activo: medico.activo,
      });
    } else {
      setFormData({
        nombre: "",
        especialidad: "",
        email: "",
        telefono: "",
        consultorio: "",
        credenciales: "",
        activo: true,
      });
    }
  }, [medico, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Guardando médico:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {medico ? "Editar Médico" : "Nuevo Médico"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input
                  id="especialidad"
                  value={formData.especialidad}
                  onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                  placeholder="Cardiología"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credenciales">Credenciales</Label>
                <Input
                  id="credenciales"
                  value={formData.credenciales}
                  onChange={(e) => setFormData({ ...formData, credenciales: e.target.value })}
                  placeholder="MN 12345"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+54 11 1234-5678"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultorio">Consultorio</Label>
              <Select value={formData.consultorio} onValueChange={(value) => setFormData({ ...formData, consultorio: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar consultorio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clínica San Rafael">Clínica San Rafael</SelectItem>
                  <SelectItem value="Centro Médico Norte">Centro Médico Norte</SelectItem>
                  <SelectItem value="Consultorio Dr. Pérez">Consultorio Dr. Pérez</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="activo">Estado Activo</Label>
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {medico ? "Guardar Cambios" : "Crear Médico"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
