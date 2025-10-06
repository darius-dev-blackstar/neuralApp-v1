import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  FileText,
  Settings,
  LogOut,
  Menu,
  Shield,
  Bell,
  Search,
} from 'lucide-react';
import { adminAuthService } from '@/services/adminAuth';
import AdminConfig from '@/config/adminConfig';
import { toast } from 'sonner';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = adminAuthService.getUser();
  const isAdmin = adminAuthService.isAdmin();

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      toast.success('Sesión cerrada exitosamente');
      navigate(AdminConfig.routes.login);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      href: AdminConfig.routes.dashboard,
      icon: LayoutDashboard,
      permission: 'view_dashboard',
    },
    {
      title: 'Consultorios',
      href: AdminConfig.routes.clinics,
      icon: Building2,
      permission: 'view_clinics',
    },
    {
      title: 'Médicos',
      href: AdminConfig.routes.doctors,
      icon: UserCheck,
      permission: 'view_doctors',
    },
    {
      title: 'Usuarios',
      href: AdminConfig.routes.users,
      icon: Users,
      permission: 'view_users',
    },
    {
      title: 'Logs',
      href: AdminConfig.routes.logs,
      icon: FileText,
      permission: 'view_logs',
    },
    {
      title: 'Configuración',
      href: AdminConfig.routes.settings,
      icon: Settings,
      permission: 'view_settings',
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    adminAuthService.hasPermission(item.permission)
  );

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center border-b px-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-lg">Admin Panel</span>
              </div>
            </div>

            {/* Navigation */}
            <SidebarContent className="flex-1">
              <SidebarGroup>
                <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filteredMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            onClick={() => navigate(item.href)}
                            isActive={isActiveRoute(item.href)}
                            className="w-full justify-start"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {/* User Info */}
            <div className="border-t p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
                          {isAdmin ? 'Admin' : 'Operador'}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex h-16 items-center justify-between border-b bg-white px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="border-0 bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              {/* Status */}
              <Badge variant="outline" className="text-green-600 border-green-200">
                Sistema Activo
              </Badge>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
