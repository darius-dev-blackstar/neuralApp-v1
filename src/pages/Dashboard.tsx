import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const statsData = [
  { icon: Users, label: "Total Pacientes", value: "1,284", trend: "+12%", color: "text-primary" },
  { icon: Calendar, label: "Citas de Hoy", value: "24", trend: "+5%", color: "text-secondary" },
  { icon: Clock, label: "Próximas Citas", value: "38", trend: "+8%", color: "text-purple-500" },
  { icon: TrendingUp, label: "Tasa Asistencia", value: "94%", trend: "+2%", color: "text-green-500" },
];

const chartData = [
  { name: "Ene", citas: 45 },
  { name: "Feb", citas: 52 },
  { name: "Mar", citas: 61 },
  { name: "Abr", citas: 58 },
  { name: "May", citas: 70 },
  { name: "Jun", citas: 65 },
];

const upcomingAppointments = [
  { id: 1, patient: "María González", time: "09:00", type: "Consulta General", status: "Confirmada" },
  { id: 2, patient: "Carlos Rodríguez", time: "10:30", type: "Seguimiento", status: "Pendiente" },
  { id: 3, patient: "Ana Martínez", time: "11:00", type: "Control", status: "Confirmada" },
  { id: 4, patient: "Luis Fernández", time: "14:00", type: "Primera Vez", status: "Confirmada" },
];

const calendarEvents = [
  {
    title: "María González",
    start: new Date(new Date().setHours(9, 0)),
    backgroundColor: "#458BFF",
  },
  {
    title: "Carlos Rodríguez",
    start: new Date(new Date().setHours(10, 30)),
    backgroundColor: "#FF7829",
  },
  {
    title: "Ana Martínez",
    start: new Date(new Date().setHours(11, 0)),
    backgroundColor: "#458BFF",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                  <p className="text-sm text-green-600 mt-1">{stat.trend} vs mes anterior</p>
                </div>
                <div className={`${stat.color} bg-accent p-3 rounded-lg`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Evolución de Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="citas" 
                  stroke="#458BFF" 
                  strokeWidth={3}
                  dot={{ fill: "#458BFF", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Citas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="citas" fill="#458BFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Appointments and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximas Citas</CardTitle>
            <Button variant="outline" size="sm">Ver Todas</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-accent rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-primary/10 rounded-lg">
                      <span className="text-lg font-bold text-primary">{appointment.time.split(':')[0]}</span>
                      <span className="text-xs text-muted-foreground">{appointment.time.split(':')[1]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      appointment.status === "Confirmada"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Agenda del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="fullcalendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                locale="es"
                headerToolbar={{
                  left: "",
                  center: "title",
                  right: "",
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                height="400px"
                events={calendarEvents}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
