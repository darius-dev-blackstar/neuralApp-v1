# Panel de Administración - NeuralApp

## 📋 Descripción

Panel de administración independiente para la gestión de consultorios, médicos y usuarios administrativos de NeuralApp. Este panel está completamente separado del dashboard de doctores y no tiene acceso a datos clínicos.

## 🔐 Características de Seguridad

- **Autenticación JWT** con roles (admin/operator)
- **Validación de permisos** granular
- **Logs de auditoría** completos
- **Separación total** de datos clínicos
- **Protección de rutas** con validación de tokens

## 🏗️ Estructura del Proyecto

```
src/
├── components/admin/
│   ├── AdminLayout.tsx          # Layout principal del panel
│   └── AdminProtectedRoute.tsx  # Componente de rutas protegidas
├── pages/admin/
│   ├── AdminLogin.tsx           # Página de login
│   └── AdminDashboard.tsx       # Dashboard principal
├── services/
│   └── adminAuth.ts             # Servicio de autenticación
└── modules/admin/               # Módulos específicos del admin
    ├── auth/                    # Autenticación
    ├── dashboard/               # Dashboard y KPIs
    ├── clinics/                 # Gestión de consultorios
    ├── doctors/                 # Gestión de médicos
    ├── users/                   # Gestión de usuarios admin
    └── logs/                    # Logs y auditoría
```

## 🚀 Funcionalidades Implementadas

### ✅ Login y Autenticación
- Página de login segura con validación
- Autenticación JWT con roles
- Validación de permisos granular
- Manejo de errores y estados de carga
- Redirección automática post-login

### ✅ Dashboard Principal
- Métricas del sistema en tiempo real
- KPIs administrativos (consultorios, médicos, usuarios)
- Actividad reciente del sistema
- Estado del sistema y alertas
- Ingresos mensuales (mock data)

### ✅ Layout y Navegación
- Sidebar responsive con navegación
- Topbar con búsqueda y notificaciones
- Información del usuario y logout
- Indicadores de estado del sistema

## 🔧 Configuración

### Variables de Entorno

Copia `admin.env.example` a `.env.local` y configura:

```bash
# API del panel admin
VITE_ADMIN_API_URL=http://localhost:3001/api/admin

# Configuración de autenticación
VITE_JWT_SECRET=your-jwt-secret-key
VITE_TOKEN_EXPIRY=24h

# Base de datos
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=neuralapp_admin
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Acceder al panel admin
http://localhost:5173/admin/login
```

## 👥 Roles y Permisos

### Admin (Administrador Completo)
- Acceso total a todas las funcionalidades
- Gestión completa de consultorios, médicos y usuarios
- Acceso a logs y auditoría
- Configuración del sistema

### Operator (Operador Limitado)
- Visualización de consultorios y médicos
- Edición limitada de información
- Acceso a logs de solo lectura
- Sin acceso a configuración crítica

## 🛡️ Reglas de Seguridad

1. **Separación Total**: El panel admin NO accede a datos clínicos
2. **Validación de Roles**: Cada acción valida permisos específicos
3. **Logs Obligatorios**: Todas las acciones quedan registradas
4. **Tokens Seguros**: JWT con expiración y renovación automática
5. **Validación de Estado**: Usuarios inactivos no pueden acceder

## 📊 Próximas Funcionalidades

### 🔄 En Desarrollo
- [ ] Gestión de consultorios (CRUD completo)
- [ ] Gestión de médicos (CRUD completo)
- [ ] Gestión de usuarios admin (CRUD completo)
- [ ] Sistema de logs y auditoría
- [ ] Exportación de reportes

### 📋 Planificado
- [ ] Notificaciones en tiempo real
- [ ] Dashboard con gráficos avanzados
- [ ] Configuración del sistema
- [ ] Backup y restauración
- [ ] Integración con APIs externas

## 🔗 Rutas del Panel Admin

```
/admin/login              # Login del panel admin
/admin/dashboard          # Dashboard principal
/admin/clinics            # Gestión de consultorios
/admin/doctors            # Gestión de médicos
/admin/users              # Gestión de usuarios admin
/admin/logs               # Logs y auditoría
/admin/settings            # Configuración
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests específicos del admin
npm run test:admin

# Coverage
npm run test:coverage
```

## 📝 Notas de Desarrollo

- **Independiente**: Completamente separado del dashboard de doctores
- **Escalable**: Arquitectura modular para fácil expansión
- **Seguro**: Múltiples capas de validación y seguridad
- **Auditable**: Logs completos de todas las acciones
- **Responsive**: Diseño adaptable a todos los dispositivos

## 🤝 Contribución

1. Trabajar en la rama `admin-integration`
2. Seguir las reglas de seguridad establecidas
3. Mantener separación total de datos clínicos
4. Documentar todas las nuevas funcionalidades
5. Incluir tests para nuevas características

## 📞 Soporte

Para soporte técnico del panel admin:
- Email: admin@neuralapp.cloud
- Documentación: `/docs/admin`
- Issues: GitHub Issues con label `admin-panel`
