import { Bell, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";

interface TopbarProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export function Topbar({ onMenuToggle, isMobile }: TopbarProps) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Obtener información del usuario desde localStorage
  const userName = localStorage.getItem("userName") || "Dr. Juan Pérez";
  const userRole = localStorage.getItem("userRole") || "DOCTOR";

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Usar el servicio de autenticación para logout
      await authService.logout();
      
      // Mostrar confirmación
      alert("Sesión cerrada correctamente");
      
      // Redirigir al login usando window.location.href como se especifica
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      // Aún así limpiar tokens locales y redirigir
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Botón de Menú Móvil */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu size={20} />
          </Button>
        )}

        {/* Mensaje de Bienvenida */}
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Hola, {userName} 👋
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden sm:block">
            Bienvenido de nuevo a tu panel médico
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </Button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
