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

const queryClient = new QueryClient();

const App = () => {
  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Ruta de Login */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              } 
            />
            
            {/* Rutas Protegidas */}
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
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
