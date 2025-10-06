import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Citas from "./pages/Citas";
import Estadisticas from "./pages/Estadisticas";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";

// Admin Panel Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

import AdminConfig from '@/config/adminConfig';

const App = () => {
  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const isAdminAuthenticated = !!localStorage.getItem(AdminConfig.storage.keys.token);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rutas del Panel Admin */}
            <Route 
              path={AdminConfig.routes.login} 
              element={
                isAdminAuthenticated ? <Navigate to={AdminConfig.routes.dashboard} replace /> : <AdminLogin />
              } 
            />
            
            <Route
              path={AdminConfig.routes.base}
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to={AdminConfig.routes.dashboard} replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Aquí se agregarán más rutas del admin */}
            </Route>

            {/* Ruta de Login del Dashboard de Doctores */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              } 
            />
            
            {/* Rutas Protegidas del Dashboard de Doctores */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/pacientes"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <Layout><Pacientes /></Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/citas"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <Layout><Citas /></Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/estadisticas"
              element={
                <ProtectedRoute>
                  <Layout><Estadisticas /></Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute>
                  <Layout><Configuracion /></Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Ruta por defecto */}
            <Route 
              path="*" 
              element={<NotFound />}
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
