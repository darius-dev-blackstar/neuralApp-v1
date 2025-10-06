import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Consultorios from "./pages/Consultorios";
import Medicos from "./pages/Medicos";
import UsuariosAdmin from "./pages/UsuariosAdmin";
import LogsAdmin from "./pages/LogsAdmin";
import LoginAdmin from "./pages/LoginAdmin";

const queryClient = new QueryClient();

const AppAdmin = () => {
  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem("neuralapp_admin_token");
    return !!token;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/admin">
          <Routes>
            <Route path="/login" element={<LoginAdmin />} />
            <Route 
              path="/*" 
              element={
                isAuthenticated() ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="consultorios" element={<Consultorios />} />
              <Route path="medicos" element={<Medicos />} />
              <Route path="usuarios" element={<UsuariosAdmin />} />
              <Route path="logs" element={<LogsAdmin />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppAdmin;
