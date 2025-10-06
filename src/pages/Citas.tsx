import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Maximize2, Minimize2 } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  patient: string;
  type: string;
  status: string;
  backgroundColor: string;
}

const initialAppointments: Appointment[] = [
  {
    id: "1",
    title: "María González",
    start: new Date(2025, 9, 2, 9, 0),
    end: new Date(2025, 9, 2, 10, 0),
    patient: "María González",
    type: "Consulta General",
    status: "Confirmada",
    backgroundColor: "#458BFF",
  },
  {
    id: "2",
    title: "Carlos Rodríguez",
    start: new Date(2025, 9, 2, 10, 30),
    end: new Date(2025, 9, 2, 11, 30),
    patient: "Carlos Rodríguez",
    type: "Seguimiento",
    status: "Pendiente",
    backgroundColor: "#FF7829",
  },
  {
    id: "3",
    title: "Ana Martínez",
    start: new Date(2025, 9, 3, 11, 0),
    end: new Date(2025, 9, 3, 12, 0),
    patient: "Ana Martínez",
    type: "Control",
    status: "Confirmada",
    backgroundColor: "#458BFF",
  },
];

const appointmentTypes = [
  "Consulta General",
  "Seguimiento",
  "Control",
  "Primera Vez",
  "Urgencia",
];

export default function Citas() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const appointment = appointments.find((a) => a.id === clickInfo.event.id);
    if (appointment) {
      alert(`Cita: ${appointment.patient}\nTipo: ${appointment.type}\nEstado: ${appointment.status}`);
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Calendario de Citas</h1>
          <Button
            onClick={() => setIsFullscreen(false)}
            variant="outline"
            size="sm"
          >
            <Minimize2 className="mr-2" size={18} />
            Salir de Pantalla Completa
          </Button>
        </div>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="fullcalendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale="es"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                buttonText={{
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                height="calc(100vh - 200px)"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={appointments}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Citas</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu agenda de citas médicas</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsFullscreen(true)}
            variant="outline"
          >
            <Maximize2 className="mr-2" size={18} />
            Pantalla Completa
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />
            Nueva Cita
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Calendario de Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="fullcalendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale="es"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                buttonText={{
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                height="700px"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={appointments}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .filter((apt) => apt.start >= new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 8)
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-accent rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold">{appointment.patient}</p>
                      <Badge
                        variant={appointment.status === "Confirmada" ? "default" : "secondary"}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {appointment.start.toLocaleDateString("es-ES")} -{" "}
                      {appointment.start.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Nueva Cita */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Cita</DialogTitle>
            <DialogDescription>
              Completa el formulario para agendar una nueva cita médica
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente</Label>
              <Input
                id="patient"
                placeholder="Buscar paciente por nombre..."
                list="patients-list"
              />
              <datalist id="patients-list">
                <option value="María González" />
                <option value="Carlos Rodríguez" />
                <option value="Ana Martínez" />
                <option value="Luis Fernández" />
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  defaultValue={selectedDate?.toISOString().split("T")[0]}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input id="time" type="time" defaultValue="09:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Cita</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de cita" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Información adicional sobre la cita..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">Agendar Cita</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
