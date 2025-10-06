// Servicio de autenticación específico para el panel admin
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions?: string[];
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

class AdminAuthService {
  private static instance: AdminAuthService;
  private baseURL = 'https://api.neuralapp.cloud/admin';

  private constructor() {}

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  public async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      
      // Guardar token y usuario en localStorage con prefijo específico del admin
      localStorage.setItem('neuralapp_admin_token', data.token);
      localStorage.setItem('neuralapp_admin_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  public logout(): void {
    localStorage.removeItem('neuralapp_admin_token');
    localStorage.removeItem('neuralapp_admin_user');
    window.location.href = '/admin/login';
  }

  public getToken(): string | null {
    return localStorage.getItem('neuralapp_admin_token');
  }

  public getUser(): AdminUser | null {
    const userStr = localStorage.getItem('neuralapp_admin_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user && user.isActive);
  }

  public hasRole(role: 'admin' | 'operator'): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  public isAdmin(): boolean {
    return this.hasRole('admin');
  }

  public isOperator(): boolean {
    return this.hasRole('operator');
  }

  public hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user?.permissions?.includes(permission) || false;
  }

  public async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('neuralapp_admin_token', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
}

export const adminAuthService = AdminAuthService.getInstance();
