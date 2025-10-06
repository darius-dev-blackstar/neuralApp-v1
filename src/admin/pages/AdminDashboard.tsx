import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, UserCog, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Consultorios Activos",
      value: "24",
      icon: Building2,
      trend: "+2 este mes"
    },
    {
      title: "Médicos Registrados",
      value: "156",
      icon: Users,
      trend: "+12 este mes"
    },
    {
      title: "Operadores Panel",
      value: "8",
      icon: UserCog,
      trend: "Sin cambios"
    },
    {
      title: "Actividad Hoy",
      value: "342",
      icon: Activity,
      trend: "Operaciones realizadas"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mt-1">Resumen general de neuralApp</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-apple">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { accion: "Nuevo consultorio creado", usuario: "Admin Principal", tiempo: "Hace 2 horas" },
                { accion: "Médico activado", usuario: "Operador 1", tiempo: "Hace 4 horas" },
                { accion: "Plan actualizado", usuario: "Admin Principal", tiempo: "Hace 1 día" }
              ].map((log, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <Activity className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{log.accion}</p>
                    <p className="text-xs text-muted-foreground">
                      Por {log.usuario} • {log.tiempo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planes y Facturación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { plan: "Plan Básico", cantidad: 8 },
                { plan: "Plan Professional", cantidad: 12 },
                { plan: "Plan Enterprise", cantidad: 4 }
              ].map((item) => (
                <div key={item.plan} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium">{item.plan}</span>
                  <span className="text-sm text-muted-foreground">{item.cantidad} consultorios</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
