import axios from 'axios';

// Tipos para el panel admin
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminUser;
  expiresIn: number;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
}

// Configuración de la API del panel admin
const ADMIN_API_BASE_URL = process.env.VITE_ADMIN_API_URL || 'http://localhost:3001/api/admin';

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas de error
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export class AdminAuthService {
  private static instance: AdminAuthService;
  private authState: AdminAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };

  private constructor() {
    this.loadAuthFromStorage();
  }

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  private loadAuthFromStorage(): void {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState = {
          isAuthenticated: true,
          user,
          token,
        };
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuth();
      }
    }
  }

  public async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const response = await adminApi.post('/auth/login', credentials);
      const { token, user, expiresIn } = response.data;

      // Guardar en localStorage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));

      // Actualizar estado
      this.authState = {
        isAuthenticated: true,
        user,
        token,
      };

      return { token, user, expiresIn };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error de autenticación');
    }
  }

  public async logout(): Promise<void> {
    try {
      await adminApi.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearAuth();
    }
  }

  public async refreshToken(): Promise<string> {
    try {
      const response = await adminApi.post('/auth/refresh');
      const { token } = response.data;
      
      localStorage.setItem('admin_token', token);
      this.authState.token = token;
      
      return token;
    } catch (error) {
      this.clearAuth();
      throw new Error('Error refreshing token');
    }
  }

  public async validateToken(): Promise<boolean> {
    try {
      const response = await adminApi.get('/auth/validate');
      return response.status === 200;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }

  public clearAuth(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }

  public getAuthState(): AdminAuthState {
    return { ...this.authState };
  }

  public isAdmin(): boolean {
    return this.authState.user?.role === 'admin';
  }

  public isOperator(): boolean {
    return this.authState.user?.role === 'operator';
  }

  public hasPermission(permission: string): boolean {
    if (!this.authState.user) return false;
    
    // Los admins tienen todos los permisos
    if (this.authState.user.role === 'admin') return true;
    
    // Los operadores tienen permisos limitados
    const operatorPermissions = [
      'view_clinics',
      'view_doctors',
      'view_users',
      'view_logs',
      'edit_clinics',
      'edit_doctors',
    ];
    
    return operatorPermissions.includes(permission);
  }

  public getToken(): string | null {
    return this.authState.token;
  }

  public getUser(): AdminUser | null {
    return this.authState.user;
  }
}

// Instancia singleton
export const adminAuthService = AdminAuthService.getInstance();

// Hook para usar la autenticación en componentes React
export const useAdminAuth = () => {
  const authService = adminAuthService;
  
  return {
    ...authService.getAuthState(),
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
    validateToken: authService.validateToken.bind(authService),
    isAdmin: authService.isAdmin.bind(authService),
    isOperator: authService.isOperator.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    getToken: authService.getToken.bind(authService),
    getUser: authService.getUser.bind(authService),
  };
};
