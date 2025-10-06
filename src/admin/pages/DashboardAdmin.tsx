import { useState, useEffect } from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminCard from "../components/AdminCard";

interface DashboardStats {
  clinics: number;
  doctors: number;
  users: number;
  activeSessions: number;
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState<DashboardStats>({
    clinics: 0,
    doctors: 0,
    users: 0,
    activeSessions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadStats = async () => {
      try {
        // Aquí harías la llamada real a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          clinics: 12,
          doctors: 37,
          users: 5,
          activeSessions: 23,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Administrativo</h1>
            <p className="text-slate-600">Resumen general del sistema NeuralApp</p>
          </div>
          
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminCard 
              title="Clínicas Activas" 
              value={isLoading ? "..." : stats.clinics.toString()} 
              icon="🏥"
              trend="+2 este mes"
              color="blue"
              isLoading={isLoading}
            />
            <AdminCard 
              title="Doctores Registrados" 
              value={isLoading ? "..." : stats.doctors.toString()} 
              icon="👨‍⚕️"
              trend="+5 este mes"
              color="green"
              isLoading={isLoading}
            />
            <AdminCard 
              title="Usuarios del Panel" 
              value={isLoading ? "..." : stats.users.toString()} 
              icon="👥"
              trend="Sin cambios"
              color="purple"
              isLoading={isLoading}
            />
            <AdminCard 
              title="Sesiones Activas" 
              value={isLoading ? "..." : stats.activeSessions.toString()} 
              icon="🟢"
              trend="+8 hoy"
              color="orange"
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividad reciente */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Nueva clínica registrada</p>
                      <p className="text-xs text-slate-500">Clínica San Rafael - ID: CLN-001</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Hace 2 horas</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Doctor activado</p>
                      <p className="text-xs text-slate-500">Dr. María González - Cardiología</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Hace 4 horas</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Usuario creado</p>
                      <p className="text-xs text-slate-500">Operador: Juan Pérez</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Hace 6 horas</span>
                </div>
              </div>
            </div>

            {/* Estado del sistema */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Estado del Sistema</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">API Backend</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Base de Datos</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Servidor Web</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">SSL/TLS</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Válido</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}