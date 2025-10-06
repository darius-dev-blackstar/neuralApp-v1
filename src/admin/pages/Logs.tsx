import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";

export default function Logs() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Logs del Sistema</h1>
            <p className="text-gray-600 mt-2">Registro de actividades administrativas</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Registro de Actividades</h2>
              <div className="flex space-x-2">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Exportar CSV
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Filtrar
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nueva clínica registrada</p>
                    <p className="text-xs text-gray-500">Clínica San Rafael - ID: CLN-001</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">admin@neuralapp.cloud</p>
                  <p className="text-xs text-gray-500">2024-01-15 14:30:25</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Doctor activado</p>
                    <p className="text-xs text-gray-500">Dr. María González - Cardiología</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">operador1@neuralapp.cloud</p>
                  <p className="text-xs text-gray-500">2024-01-15 12:15:42</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Intento de acceso fallido</p>
                    <p className="text-xs text-gray-500">IP: 192.168.1.100 - Credenciales inválidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Sistema</p>
                  <p className="text-xs text-gray-500">2024-01-15 10:45:18</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Usuario creado</p>
                    <p className="text-xs text-gray-500">Operador: Juan Pérez - Rol: operator</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">admin@neuralapp.cloud</p>
                  <p className="text-xs text-gray-500">2024-01-15 09:20:33</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Error del sistema</p>
                    <p className="text-xs text-gray-500">Alto uso de CPU en servidor principal</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Sistema</p>
                  <p className="text-xs text-gray-500">2024-01-15 08:15:07</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Cargar más logs
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
