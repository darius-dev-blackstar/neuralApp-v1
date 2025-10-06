import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Bell, Globe } from "lucide-react";

export default function Configuracion() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu perfil y preferencias</p>
      </div>

      {/* Perfil Médico */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="text-primary" size={20} />
            <CardTitle>Perfil Médico</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-white text-2xl">DR</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline">Cambiar Foto</Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG o GIF. Máximo 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Información Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" defaultValue="Juan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" defaultValue="Pérez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="juan.perez@mediapp.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" defaultValue="+34 612 345 678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidad</Label>
              <Input id="specialty" defaultValue="Médico General" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Número de Licencia</Label>
              <Input id="license" defaultValue="MED-12345" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              rows={4}
              defaultValue="Médico general con más de 10 años de experiencia en atención primaria..."
            />
          </div>

          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90">Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="text-primary" size={20} />
            <CardTitle>Seguridad</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90">Cambiar Contraseña</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="text-primary" size={20} />
            <CardTitle>Notificaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones de Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibir emails sobre nuevas citas y recordatorios
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones Push</Label>
              <p className="text-sm text-muted-foreground">
                Recibir notificaciones en tiempo real
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recordatorios de Citas</Label>
              <p className="text-sm text-muted-foreground">
                Recordatorios automáticos 24h antes de cada cita
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="text-primary" size={20} />
            <CardTitle>Preferencias</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select defaultValue="es">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Zona Horaria</Label>
            <Select defaultValue="europe">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="europe">Europa/Madrid (GMT+1)</SelectItem>
                <SelectItem value="america">América/New York (GMT-5)</SelectItem>
                <SelectItem value="asia">Asia/Tokyo (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90">Guardar Preferencias</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
