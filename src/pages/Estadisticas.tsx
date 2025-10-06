import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { name: "Ene", citas: 45, pacientes: 38 },
  { name: "Feb", citas: 52, pacientes: 42 },
  { name: "Mar", citas: 61, pacientes: 51 },
  { name: "Abr", citas: 58, pacientes: 48 },
  { name: "May", citas: 70, pacientes: 59 },
  { name: "Jun", citas: 65, pacientes: 55 },
  { name: "Jul", citas: 72, pacientes: 61 },
  { name: "Ago", citas: 68, pacientes: 57 },
];

const appointmentTypesData = [
  { name: "Consulta General", value: 145, color: "#458BFF" },
  { name: "Seguimiento", value: 98, color: "#FF7829" },
  { name: "Control", value: 76, color: "#10B981" },
  { name: "Primera Vez", value: 54, color: "#F59E0B" },
  { name: "Urgencia", value: 32, color: "#EF4444" },
];

const weeklyPatientsData = [
  { week: "Sem 1", nuevos: 12, recurrentes: 28 },
  { week: "Sem 2", nuevos: 15, recurrentes: 32 },
  { week: "Sem 3", nuevos: 10, recurrentes: 35 },
  { week: "Sem 4", nuevos: 18, recurrentes: 30 },
];

const attendanceData = [
  { name: "Asistieron", value: 94, color: "#10B981" },
  { name: "No Asistieron", value: 6, color: "#EF4444" },
];

export default function Estadisticas() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="text-muted-foreground mt-1">
          Análisis detallado de tu actividad médica
        </p>
      </div>

      {/* Evolución Mensual */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Evolución de Citas y Pacientes por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="citas"
                stroke="#458BFF"
                strokeWidth={3}
                dot={{ fill: "#458BFF", r: 5 }}
                name="Citas"
              />
              <Line
                type="monotone"
                dataKey="pacientes"
                stroke="#FF7829"
                strokeWidth={3}
                dot={{ fill: "#FF7829", r: 5 }}
                name="Pacientes"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Cita */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Distribución por Tipo de Cita</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasa de Asistencia */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Tasa de Asistencia</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pacientes Nuevos vs Recurrentes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pacientes Nuevos vs Recurrentes por Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyPatientsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="nuevos" fill="#458BFF" radius={[8, 8, 0, 0]} name="Nuevos" />
              <Bar
                dataKey="recurrentes"
                fill="#FF7829"
                radius={[8, 8, 0, 0]}
                name="Recurrentes"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Citas</p>
              <h3 className="text-4xl font-bold text-primary mt-2">405</h3>
              <p className="text-xs text-green-600 mt-1">+12% vs período anterior</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Promedio Diario</p>
              <h3 className="text-4xl font-bold text-secondary mt-2">18</h3>
              <p className="text-xs text-green-600 mt-1">+5% vs período anterior</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Pacientes Activos</p>
              <h3 className="text-4xl font-bold text-green-600 mt-2">1,284</h3>
              <p className="text-xs text-green-600 mt-1">+8% vs período anterior</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Satisfacción</p>
              <h3 className="text-4xl font-bold text-yellow-500 mt-2">4.8</h3>
              <p className="text-xs text-green-600 mt-1">+0.2 vs período anterior</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
