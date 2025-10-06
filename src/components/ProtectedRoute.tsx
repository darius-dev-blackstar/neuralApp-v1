import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles = ['DOCTOR', 'ADMIN'] }: ProtectedRouteProps) {
  // Verificar si hay token de acceso
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");

  // Función para verificar si un token está expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      // Verificar si es un token demo (no JWT)
      if (token.startsWith('demo-')) {
        return false; // Los tokens demo no expiran
      }
      
      // Para tokens JWT reales, verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp && payload.exp < now;
    } catch {
      // Si no se puede decodificar y no es demo, considerar expirado
      return !token.startsWith('demo-');
    }
  };

  // Si no hay token, redirigir al login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Si el token está expirado o es inválido, limpiar tokens y redirigir
  if (isTokenExpired(accessToken)) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    return <Navigate to="/login" replace />;
  }

  // Si hay token pero el rol no está permitido, redirigir al dashboard
  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
