import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";

export default function Settings() {
  return (
    <div className="flex h-screen bg-slate-50">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
            <p className="text-slate-600 mt-2">Configuración del sistema y preferencias</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuración General</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Sistema</label>
                  <input type="text" defaultValue="NeuralApp" className="w-full p-3 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">URL de la API</label>
                  <input type="text" defaultValue="https://api.neuralapp.cloud/admin" className="w-full p-3 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tiempo de sesión (horas)</label>
                  <input type="number" defaultValue="24" className="w-full p-3 border border-slate-300 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuración de Seguridad</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Autenticación de dos factores</span>
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">Activo</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Logs de auditoría</span>
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">Activo</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Cifrado de datos</span>
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">Activo</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
              Guardar Configuración
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
