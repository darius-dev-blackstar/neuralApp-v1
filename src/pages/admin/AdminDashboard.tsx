import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  UserCheck,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { adminAuthService } from '@/services/adminAuth';

const AdminDashboard: React.FC = () => {
  const user = adminAuthService.getUser();
  const isAdmin = adminAuthService.isAdmin();

  // Datos mock para el dashboard - en producción vendrían de la API
  const stats = {
    totalClinics: 24,
    activeClinics: 22,
    totalDoctors: 156,
    activeDoctors: 142,
    totalUsers: 8,
    activeUsers: 7,
    systemUptime: 99.8,
    monthlyRevenue: 125000,
    alerts: 3,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'clinic',
      action: 'Nuevo consultorio registrado',
      details: 'Clínica San Rafael',
      timestamp: '2024-01-15 14:30',
      status: 'success',
    },
    {
      id: 2,
      type: 'doctor',
      action: 'Médico activado',
      details: 'Dr. María González - Cardiología',
      timestamp: '2024-01-15 12:15',
      status: 'success',
    },
    {
      id: 3,
      type: 'system',
      action: 'Alerta del sistema',
      details: 'Alto uso de CPU en servidor principal',
      timestamp: '2024-01-15 10:45',
      status: 'warning',
    },
    {
      id: 4,
      type: 'user',
      action: 'Usuario creado',
      details: 'Operador: Juan Pérez',
      timestamp: '2024-01-15 09:20',
      status: 'success',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Panel de administración - {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-sm">
          {isAdmin ? 'Administrador' : 'Operador'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Consultorios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultorios</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClinics}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeClinics} activos ({Math.round((stats.activeClinics / stats.totalClinics) * 100)}%)
            </p>
            <Progress 
              value={(stats.activeClinics / stats.totalClinics) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        {/* Médicos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médicos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoctors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeDoctors} activos ({Math.round((stats.activeDoctors / stats.totalDoctors) * 100)}%)
            </p>
            <Progress 
              value={(stats.activeDoctors / stats.totalDoctors) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        {/* Usuarios del Panel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Admin</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} activos ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
            </p>
            <Progress 
              value={(stats.activeUsers / stats.totalUsers) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        {/* Estado del Sistema */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">
              Disponibilidad del sistema
            </p>
            <Progress 
              value={stats.systemUptime} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Ingresos Mensuales
            </CardTitle>
            <CardDescription>
              Resumen financiero del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+12% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>
              Notificaciones que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.alerts}
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm">
                Ver Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas acciones realizadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Ver Toda la Actividad
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
