import NavbarAdmin from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";

export default function Clinics() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Clínicas</h1>
            <p className="text-gray-600 mt-2">Administrar clínicas y consultorios</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Clínicas</h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Agregar Clínica
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Clínica San Rafael</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activa</span>
                </div>
                <p className="text-gray-600 mb-2">📍 Av. Principal 123, Ciudad</p>
                <p className="text-gray-600 mb-2">📞 +1 234 567 8900</p>
                <p className="text-gray-600 mb-4">👨‍⚕️ 5 doctores</p>
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm">Editar</button>
                  <button className="text-red-600 hover:text-red-900 text-sm">Desactivar</button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Consultorio Central</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activa</span>
                </div>
                <p className="text-gray-600 mb-2">📍 Calle Central 456, Ciudad</p>
                <p className="text-gray-600 mb-2">📞 +1 234 567 8901</p>
                <p className="text-gray-600 mb-4">👨‍⚕️ 3 doctores</p>
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm">Editar</button>
                  <button className="text-red-600 hover:text-red-900 text-sm">Desactivar</button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Clínica del Norte</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendiente</span>
                </div>
                <p className="text-gray-600 mb-2">📍 Norte 789, Ciudad</p>
                <p className="text-gray-600 mb-2">📞 +1 234 567 8902</p>
                <p className="text-gray-600 mb-4">👨‍⚕️ 0 doctores</p>
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm">Editar</button>
                  <button className="text-green-600 hover:text-green-900 text-sm">Activar</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
