import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  mobileMenuOpen?: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Pacientes", path: "/pacientes" },
  { icon: Calendar, label: "Citas", path: "/citas" },
  { icon: BarChart3, label: "Estadísticas", path: "/estadisticas" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
];

export function Sidebar({ collapsed, onToggle, isMobile = false, mobileMenuOpen = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 shadow-md",
        isMobile 
          ? (mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64")
          : (collapsed ? "w-20" : "w-64")
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo y Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {(!collapsed || mobileMenuOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-lg text-foreground">MediApp</span>
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn("hover:bg-accent", collapsed && "mx-auto")}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          )}
        </div>

        {/* Perfil Médico */}
        <div className="p-4 border-b border-border">
          <div className={cn("flex items-center gap-3", collapsed && !mobileMenuOpen && "justify-center")}>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-white">DR</AvatarFallback>
            </Avatar>
            {(!collapsed || mobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Dr. Juan Pérez</p>
                <p className="text-xs text-muted-foreground truncate">Médico General</p>
              </div>
            )}
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  collapsed && !mobileMenuOpen && "justify-center",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                )
              }
            >
              <item.icon size={20} className="flex-shrink-0" />
              {(!collapsed || mobileMenuOpen) && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
