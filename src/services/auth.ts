import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.neuralapp.cloud';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autorización
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !token.startsWith('demo-')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && !refreshToken.startsWith('demo-')) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si el refresh falla, limpiar tokens y redirigir al login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Interfaces para tipos de datos
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'DOCTOR' | 'ADMIN';
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'DOCTOR' | 'ADMIN';
}

// Servicios de autenticación
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      } else if (error.response?.status === 403) {
        throw new Error('Cuenta desactivada');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de conexión agotado');
      } else if (!error.response) {
        throw new Error('Error de conexión. Verifica tu conexión a internet');
      } else {
        throw new Error('Error del servidor. Intenta nuevamente');
      }
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !refreshToken.startsWith('demo-')) {
        await apiClient.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Ignorar errores de logout
      console.warn('Error during logout:', error);
    } finally {
      // Limpiar tokens locales
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
    }
  },

  // Obtener perfil del usuario
  async getProfile(): Promise<User> {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  // Obtener información del usuario desde localStorage
  getCurrentUser(): User | null {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    if (!token || !role || !name) {
      return null;
    }

    return {
      id: 'current-user',
      email: 'user@neuralapp.cloud', // Se puede obtener del token JWT si es necesario
      name,
      role: role as 'DOCTOR' | 'ADMIN',
    };
  },
};

export default apiClient;
