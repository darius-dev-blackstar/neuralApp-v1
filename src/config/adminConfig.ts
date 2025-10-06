// Configuración específica para el subdominio admin.neuralapp.cloud
export const AdminConfig = {
  // URLs base según el entorno
  getApiUrl: () => {
    const isProduction = import.meta.env.PROD;
    const isAdminSubdomain = window.location.hostname === 'admin.neuralapp.cloud';
    
    if (isProduction && isAdminSubdomain) {
      return import.meta.env.VITE_ADMIN_API_URL || 'https://api.neuralapp.cloud/admin';
    }
    
    return import.meta.env.VITE_ADMIN_API_URL_DEV || 'http://localhost:3001/api/admin';
  },

  getFrontendUrl: () => {
    const isProduction = import.meta.env.PROD;
    const isAdminSubdomain = window.location.hostname === 'admin.neuralapp.cloud';
    
    if (isProduction && isAdminSubdomain) {
      return import.meta.env.VITE_ADMIN_FRONTEND_URL || 'https://admin.neuralapp.cloud';
    }
    
    return import.meta.env.VITE_ADMIN_FRONTEND_URL_DEV || 'http://localhost:5173/admin';
  },

  getDoctorDashboardUrl: () => {
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
      return import.meta.env.VITE_DOCTOR_DASHBOARD_URL || 'https://neuralapp.cloud';
    }
    
    return import.meta.env.VITE_DOCTOR_DASHBOARD_URL_DEV || 'http://localhost:5173';
  },

  // Configuración de almacenamiento separado
  storage: {
    // Prefijo para todas las claves de almacenamiento del admin
    prefix: 'neuralapp_admin_',
    
    // Claves específicas del admin
    keys: {
      token: 'neuralapp_admin_token',
      user: 'neuralapp_admin_user',
      refreshToken: 'neuralapp_admin_refresh_token',
      preferences: 'neuralapp_admin_preferences',
      lastLogin: 'neuralapp_admin_last_login',
    },

    // Separar completamente del dashboard de doctores
    isAdminStorage: (key: string) => {
      return key.startsWith('neuralapp_admin_') || 
             key.startsWith('admin_') ||
             key.includes('admin');
    },

    // Limpiar solo almacenamiento del admin
    clearAdminStorage: () => {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && AdminConfig.storage.isAdminStorage(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  },

  // Configuración de cookies
  cookies: {
    domain: () => {
      const isProduction = import.meta.env.PROD;
      return isProduction ? '.neuralapp.cloud' : 'localhost';
    },
    
    secure: () => {
      return import.meta.env.PROD;
    },
    
    sameSite: 'strict' as const,
    
    // Prefijo para cookies del admin
    prefix: 'neuralapp_admin_',
  },

  // Configuración de CORS
  cors: {
    allowedOrigins: () => {
      const isProduction = import.meta.env.PROD;
      
      if (isProduction) {
        return [
          'https://admin.neuralapp.cloud',
          'https://neuralapp.cloud'
        ];
      }
      
      return [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001'
      ];
    },
    
    credentials: true,
  },

  // Configuración de seguridad
  security: {
    // Validar que estamos en el subdominio correcto
    validateSubdomain: () => {
      const isProduction = import.meta.env.PROD;
      
      if (isProduction) {
        const currentHost = window.location.hostname;
        const expectedSubdomain = 'admin.neuralapp.cloud';
        
        if (currentHost !== expectedSubdomain) {
          console.warn(`Acceso desde subdominio incorrecto: ${currentHost}. Esperado: ${expectedSubdomain}`);
          return false;
        }
      }
      
      return true;
    },

    // Prevenir acceso desde el dashboard de doctores
    preventDoctorDashboardAccess: () => {
      const isProduction = import.meta.env.PROD;
      
      if (isProduction) {
        const currentHost = window.location.hostname;
        const doctorDashboardHost = 'neuralapp.cloud';
        
        if (currentHost === doctorDashboardHost) {
          console.error('Acceso no autorizado: Panel admin no debe ejecutarse desde el dashboard de doctores');
          window.location.href = 'https://admin.neuralapp.cloud';
          return false;
        }
      }
      
      return true;
    }
  },

  // Configuración de rutas
  routes: {
    // Rutas base del admin
    base: '/admin',
    
    // Rutas específicas
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    clinics: '/admin/clinics',
    doctors: '/admin/doctors',
    users: '/admin/users',
    logs: '/admin/logs',
    settings: '/admin/settings',
    
    // Redirecciones
    getRedirectAfterLogin: () => {
      return AdminConfig.routes.dashboard;
    },
    
    getRedirectAfterLogout: () => {
      return AdminConfig.routes.login;
    }
  },

  // Configuración de la aplicación
  app: {
    name: 'NeuralApp Admin Panel',
    version: '1.0.0',
    description: 'Panel de administración para NeuralApp',
    
    // Metadatos para SEO
    meta: {
      title: 'Panel de Administración - NeuralApp',
      description: 'Panel de administración seguro para gestionar consultorios, médicos y usuarios de NeuralApp',
      keywords: 'neuralapp, admin, administración, consultorios, médicos',
    }
  }
};

// Validaciones de seguridad al cargar
if (typeof window !== 'undefined') {
  // Validar subdominio
  AdminConfig.security.validateSubdomain();
  
  // Prevenir acceso desde dashboard de doctores
  AdminConfig.security.preventDoctorDashboardAccess();
}

export default AdminConfig;
