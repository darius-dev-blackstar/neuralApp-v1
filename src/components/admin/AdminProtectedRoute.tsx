import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminAuthService } from '@/services/adminAuth';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'admin' | 'operator';
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
}) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const authState = adminAuthService.getAuthState();
        
        // Verificar si está autenticado
        if (!authState.isAuthenticated || !authState.user) {
          setIsValid(false);
          return;
        }

        // Verificar si el usuario está activo
        if (!authState.user.isActive) {
          setIsValid(false);
          return;
        }

        // Verificar rol requerido
        if (requiredRole && authState.user.role !== requiredRole) {
          setIsValid(false);
          return;
        }

        // Verificar permiso requerido
        if (requiredPermission && !adminAuthService.hasPermission(requiredPermission)) {
          setIsValid(false);
          return;
        }

        // Validar token con el servidor
        const isTokenValid = await adminAuthService.validateToken();
        if (!isTokenValid) {
          setIsValid(false);
          return;
        }

        setIsValid(true);
      } catch (error) {
        console.error('Error validating access:', error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [requiredPermission, requiredRole]);

  // Mostrar loading mientras valida
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Validando acceso...</p>
        </div>
      </div>
    );
  }

  // Redirigir al login si no es válido
  if (!isValid) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Renderizar el contenido si es válido
  return <>{children}</>;
};

export default AdminProtectedRoute;
