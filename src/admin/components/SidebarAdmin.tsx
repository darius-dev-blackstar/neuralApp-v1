import { useState } from "react";

interface MenuItem {
  name: string;
  href: string;
  icon: string;
  current: boolean;
}

export default function SidebarAdmin() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊", current: true },
    { name: "Clínicas", href: "/admin/clinics", icon: "🏥", current: false },
    { name: "Doctores", href: "/admin/doctors", icon: "👨‍⚕️", current: false },
    { name: "Usuarios", href: "/admin/users", icon: "👥", current: false },
    { name: "Operadores", href: "/admin/operators", icon: "⚙️", current: false },
    { name: "Logs", href: "/admin/logs", icon: "📋", current: false },
  ]);

  const handleMenuClick = (clickedItem: MenuItem) => {
    setMenuItems(menuItems.map(item => ({
      ...item,
      current: item.name === clickedItem.name
    })));
    
    // Navegar a la página
    window.location.href = clickedItem.href;
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">NeuralApp</h1>
            <p className="text-xs text-gray-500">Panel Admin</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.current
                  ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Información del sistema */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Sistema Operativo</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">admin.neuralapp.cloud</p>
        </div>
      </div>
    </div>
  );
}
