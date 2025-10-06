import { useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function NavbarAdmin() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-slate-900">Panel Administrativo</h2>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500">
              <span>•</span>
              <span>Sistema NeuralApp</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <button className="p-2 text-slate-400 hover:text-slate-600 relative transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L9 15l4.5 4.5" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Perfil del usuario */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900">{user?.name || "Administrador"}</p>
                  <p className="text-xs text-slate-500">{user?.role || "admin"}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown del perfil */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-slate-200">
                  <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Mi Perfil
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Configuración
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}