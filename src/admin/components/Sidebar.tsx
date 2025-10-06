import { NavLink } from "react-router-dom";
import { LayoutDashboard, Building2, Users, UserCog, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/consultorios", icon: Building2, label: "Consultorios" },
  { path: "/admin/medicos", icon: Users, label: "Médicos" },
  { path: "/admin/usuarios", icon: UserCog, label: "Usuarios" },
  { path: "/admin/logs", icon: FileText, label: "Logs" },
];

export function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("neuralapp_admin_token");
    localStorage.removeItem("neuralapp_admin_user");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold">neuralApp Admin</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-apple"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
