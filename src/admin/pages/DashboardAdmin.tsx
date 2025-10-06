import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminCard from "../components/AdminCard";

export default function DashboardAdmin() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-2">Resumen general del sistema NeuralApp</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminCard 
              title="Clínicas Activas" 
              value="12" 
              icon="🏥"
              trend="+2 este mes"
              color="blue"
            />
            <AdminCard 
              title="Doctores Registrados" 
              value="37" 
              icon="👨‍⚕️"
              trend="+5 este mes"
              color="green"
            />
            <AdminCard 
              title="Usuarios del Panel" 
              value="5" 
              icon="👥"
              trend="Sin cambios"
              color="purple"
            />
            <AdminCard 
              title="Sesiones Activas" 
              value="23" 
              icon="🟢"
              trend="+8 hoy"
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de actividad reciente */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Nueva clínica registrada</span>
                  </div>
                  <span className="text-xs text-gray-500">Hace 2 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Doctor activado</span>
                  </div>
                  <span className="text-xs text-gray-500">Hace 4 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Usuario creado</span>
                  </div>
                  <span className="text-xs text-gray-500">Hace 6 horas</span>
                </div>
              </div>
            </div>

            {/* Estado del sistema */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">API Backend</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Base de Datos</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Servidor Web</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">SSL/TLS</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Válido</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
