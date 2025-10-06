import { useState, useEffect } from 'react';
import { adminAuthService, AdminUser } from '../services/adminAuth';

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = adminAuthService.getUser();
      const authenticated = adminAuthService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await adminAuthService.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    adminAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role: 'admin' | 'operator') => {
    return adminAuthService.hasRole(role);
  };

  const isAdmin = () => {
    return adminAuthService.isAdmin();
  };

  const isOperator = () => {
    return adminAuthService.isOperator();
  };

  const hasPermission = (permission: string) => {
    return adminAuthService.hasPermission(permission);
  };

  const refreshToken = async () => {
    return await adminAuthService.refreshToken();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
    isOperator,
    hasPermission,
    refreshToken,
  };
};
