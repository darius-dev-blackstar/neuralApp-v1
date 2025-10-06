# NeuralApp - Panel Admin Integrado

Este proyecto ahora incluye un **Panel Administrativo completamente integrado** inspirado en el diseño de Lovable, sin dependencias externas ni subdominios separados.

## 🎯 Objetivo Cumplido

✅ **Integrar el dashboard de Lovable** dentro del proyecto principal como módulo administrativo completo  
✅ **Sin dependencia externa** ni subdominio separado  
✅ **Mismo dominio** con rutas separadas (`/admin/*`)  
✅ **Código versionado** dentro del proyecto principal  

## 🏗️ Estructura del Proyecto

```
neuralapp-v1/
├─ src/
│ ├─ admin/                    # Panel Administrativo Integrado
│ │   ├─ AppAdmin.tsx         # Router con basename='/admin'
│ │   ├─ mainAdmin.tsx        # Entrypoint independiente
│ │   ├─ pages/               # Páginas del admin
│ │   │   ├─ LoginAdmin.tsx
│ │   │   ├─ DashboardAdmin.tsx
│ │   │   ├─ Users.tsx
│ │   │   ├─ Clinics.tsx
│ │   │   ├─ Operators.tsx
│ │   │   ├─ Logs.tsx
│ │   │   └─ Settings.tsx
│ │   ├─ components/          # Componentes específicos del admin
│ │   │   ├─ NavbarAdmin.tsx
│ │   │   ├─ SidebarAdmin.tsx
│ │   │   └─ AdminCard.tsx
│ │   ├─ services/            # Servicios del admin
│ │   │   └─ adminAuth.ts
│ │   └─ hooks/               # Hooks del admin
│ │       └─ useAdminAuth.ts
│ ├─ doctor/                   # Dashboard de Doctores (existente)
│ └─ shared/                   # Utilidades comunes
├─ vite.admin.config.ts        # Build específico para admin
├─ vite.doctor.config.ts       # Build del dashboard médico
└─ package.json
```

## 🚀 Scripts Disponibles

### Panel Administrativo
```bash
# Desarrollo
npm run dev:admin          # Servidor en localhost:5175

# Build
npm run build:admin        # Genera dist-admin/

# Preview
npm run preview:admin      # Preview del build

# Linting y Type Checking
npm run lint:admin
npm run type-check:admin
```

### Dashboard de Doctores
```bash
# Desarrollo
npm run dev:doctor         # Servidor en localhost:5174

# Build
npm run build:doctor       # Genera dist-doctor/

# Preview
npm run preview:doctor     # Preview del build
```

## 🌐 URLs y Rutas

### Panel Administrativo
- **Desarrollo:** http://localhost:5175/admin/login
- **Producción:** https://app.neuralapp.cloud/admin/login
- **Rutas disponibles:**
  - `/admin/login` - Página de login
  - `/admin/dashboard` - Dashboard principal
  - `/admin/users` - Gestión de usuarios
  - `/admin/clinics` - Gestión de clínicas
  - `/admin/operators` - Gestión de operadores
  - `/admin/logs` - Logs del sistema
  - `/admin/settings` - Configuración

### Dashboard de Doctores
- **Desarrollo:** http://localhost:5174
- **Producción:** https://app.neuralapp.cloud

## 🔧 Configuración

### Variables de Entorno
```bash
VITE_API_URL=https://api.neuralapp.cloud/admin
VITE_ENV=production
VITE_ADMIN_FRONTEND_URL=https://app.neuralapp.cloud/admin
VITE_DOCTOR_DASHBOARD_URL=https://app.neuralapp.cloud
```

### Almacenamiento Local Separado
- **Admin:** `neuralapp_admin_token`, `neuralapp_admin_user`
- **Doctor:** `neuralapp_token`, `neuralapp_user`

## 🔒 Seguridad

### Separación Completa
- ✅ **Rutas independientes:** `/admin/*` vs `/`
- ✅ **Tokens separados:** Diferentes prefijos en localStorage
- ✅ **Builds separados:** `dist-admin/` vs `dist-doctor/`
- ✅ **Configuraciones separadas:** Vite configs independientes

### CORS Configurado
- **Admin:** Solo acepta `https://app.neuralapp.cloud`
- **Doctor:** Solo acepta `https://app.neuralapp.cloud`

## 📦 Builds Independientes

### Panel Admin
```bash
npm run build:admin
```
Genera: `dist-admin/` con:
- `index.html` específico del admin
- `assets/mainAdmin-*.js` (34KB)
- `assets/vendor-*.js` (141KB)
- `assets/mainAdmin-*.css` (78KB)

### Dashboard Doctor
```bash
npm run build:doctor
```
Genera: `dist-doctor/` con:
- `assets/mainDoctor-*.js` (1MB+)
- `assets/vendor-*.js` (141KB)
- `assets/mainDoctor-*.css` (78KB)

## 🛠️ Desarrollo

### Estructura de Archivos
- **Admin:** Todo en `src/admin/`
- **Doctor:** Todo en `src/doctor/`
- **Shared:** Utilidades comunes (futuro)

### Servicios del Admin
- `adminAuth.ts`: Autenticación específica del admin
- `useAdminAuth.ts`: Hook para autenticación del admin

## 🚀 Despliegue

### Despliegue Integrado
Usar el script de despliegue integrado:
```bash
./deploy-admin-integrated.sh
```

Este script:
1. ✅ Construye el admin integrado
2. ✅ Copia archivos a `/var/www/app.neuralapp.cloud/admin/`
3. ✅ Configura Nginx para servir admin en `/admin/`
4. ✅ Configura SSL y CORS
5. ✅ Verifica el despliegue

### Estructura de Despliegue
```
/var/www/app.neuralapp.cloud/
├── index.html              # Dashboard de doctores
├── assets/                 # Assets del doctor
└── admin/                  # Panel administrativo
    ├── index.html          # Admin entrypoint
    └── assets/             # Assets del admin
```

## 🎨 Características del Panel Admin

### ✅ Funcionalidades Implementadas
- **Login seguro** con validación de roles (admin/operator)
- **Dashboard con KPIs** administrativos (clínicas, doctores, usuarios)
- **Gestión completa** de clínicas, doctores, operadores
- **Logs de actividad** del sistema
- **Configuración** del sistema
- **Sin acceso a datos clínicos** (separación total)

### ✅ Diseño Moderno
- **UI inspirada en Lovable** con TailwindCSS
- **Componentes reutilizables** y responsivos
- **Estados de carga** y manejo de errores
- **Navegación intuitiva** con sidebar y navbar
- **Gradientes y efectos** modernos

### ✅ Seguridad
- **Autenticación JWT** independiente
- **Validación de roles** y permisos
- **Headers de seguridad** activos
- **CORS configurado** correctamente

## 📊 Beneficios de la Integración

### ✅ Separación Completa
- Panel admin y dashboard de doctores completamente independientes
- Sin interferencia entre builds
- Mantenimiento más fácil

### ✅ Seguridad Mejorada
- Tokens y almacenamiento separados
- CORS específico por dominio
- Headers de seguridad independientes

### ✅ Desarrollo Eficiente
- Builds más rápidos (solo lo necesario)
- Desarrollo independiente
- Testing separado

### ✅ Escalabilidad
- Fácil agregar nuevas funcionalidades
- Deploy independiente
- Rollback independiente

## 🎯 Resultado Final

- **Panel Admin:** https://app.neuralapp.cloud/admin (completamente integrado)
- **Dashboard Doctor:** https://app.neuralapp.cloud (completamente independiente)
- **Mismo dominio** con rutas separadas
- **Builds separados** pero integrados
- **Configuraciones independientes** pero coordinadas

## 🧠 Notas Importantes

- El repositorio `neural-biz-core` fue usado solo como **fuente visual y estructural**
- **No se mantiene como dependencia** ni submódulo
- Todo el código está **versionado dentro de neuralapp-v1**
- **Sin dependencias externas** para el panel admin
- **Despliegue unificado** en el mismo servidor

¡La integración está completa y lista para producción! 🚀
