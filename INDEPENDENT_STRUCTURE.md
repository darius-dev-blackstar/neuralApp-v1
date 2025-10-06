# NeuralApp - Estructura Independiente

Este proyecto ahora utiliza una arquitectura completamente independiente que separa el Panel Administrativo del Dashboard de Doctores, manteniendo servicios y utilidades compartidas.

## 🏗️ Estructura del Proyecto

```
src/
├── admin/                    # Panel Administrativo Independiente
│   ├── AppAdmin.tsx         # Router del admin
│   ├── mainAdmin.tsx        # Entrypoint del admin
│   ├── pages/               # Páginas del admin
│   │   ├── LoginAdmin.tsx
│   │   ├── DashboardAdmin.tsx
│   │   ├── Users.tsx
│   │   ├── Clinics.tsx
│   │   ├── Operators.tsx
│   │   └── Logs.tsx
│   └── components/          # Componentes específicos del admin
│       ├── NavbarAdmin.tsx
│       ├── SidebarAdmin.tsx
│       └── AdminCard.tsx
├── doctor/                   # Dashboard de Doctores Independiente
│   ├── AppDoctor.tsx        # Router del doctor
│   ├── mainDoctor.tsx       # Entrypoint del doctor
│   └── ...                  # Páginas y componentes del doctor
├── shared/                   # Servicios y Utilidades Compartidas
│   ├── hooks/               # Hooks compartidos
│   │   └── useAdminAuth.ts
│   ├── services/            # Servicios compartidos
│   │   └── adminAuth.ts
│   ├── utils/              # Utilidades compartidas
│   │   └── index.ts
│   └── components/          # Componentes compartidos
└── pages/                   # Páginas del dashboard de doctores (legacy)
```

## 🚀 Scripts Disponibles

### Panel Administrativo
```bash
# Desarrollo
npm run dev:admin

# Build de producción
npm run build:admin

# Build de desarrollo
npm run build:admin:dev

# Preview
npm run preview:admin

# Linting
npm run lint:admin

# Type checking
npm run type-check:admin
```

### Dashboard de Doctores
```bash
# Desarrollo
npm run dev:doctor

# Build de producción
npm run build:doctor

# Build de desarrollo
npm run build:doctor:dev

# Preview
npm run preview:doctor

# Linting
npm run lint:doctor

# Type checking
npm run type-check:doctor
```

## 🌐 Despliegue

### Panel Administrativo
- **URL:** https://admin.neuralapp.cloud
- **Build:** `dist-admin/`
- **Entrypoint:** `src/admin/mainAdmin.tsx`
- **Config:** `vite.admin.config.ts`

### Dashboard de Doctores
- **URL:** https://app.neuralapp.cloud
- **Build:** `dist-doctor/`
- **Entrypoint:** `src/doctor/mainDoctor.tsx`
- **Config:** `vite.doctor.config.ts`

## 🔧 Configuración

### Variables de Entorno
```bash
# Panel Admin
VITE_API_URL=https://api.neuralapp.cloud/admin
VITE_ENV=production
VITE_ADMIN_FRONTEND_URL=https://admin.neuralapp.cloud
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
- ✅ **TypeScript separado:** `tsconfig.admin.json` vs `tsconfig.doctor.json`

### CORS Configurado
- **Admin:** Solo acepta `https://admin.neuralapp.cloud`
- **Doctor:** Solo acepta `https://app.neuralapp.cloud`

## 📦 Builds Independientes

### Panel Admin
```bash
npm run build:admin
```
Genera: `dist-admin/` con:
- `index.html` específico del admin
- `assets/mainAdmin-*.js` (28KB)
- `assets/vendor-*.js` (141KB)
- `assets/mainAdmin-*.css` (76KB)

### Dashboard Doctor
```bash
npm run build:doctor
```
Genera: `dist-doctor/` con:
- `index.html` específico del doctor
- `assets/mainDoctor-*.js` (1MB)
- `assets/vendor-*.js` (141KB)
- `assets/mainDoctor-*.css` (76KB)

## 🛠️ Desarrollo

### Estructura de Archivos
- **Admin:** Todo en `src/admin/`
- **Doctor:** Todo en `src/doctor/`
- **Shared:** Utilidades en `src/shared/`

### Servicios Compartidos
- `adminAuth.ts`: Autenticación específica del admin
- `useAdminAuth.ts`: Hook para autenticación del admin
- `utils/index.ts`: Utilidades comunes (formateo, validación, etc.)

## 🚀 Despliegue Automático

Usar el script de despliegue:
```bash
./deploy-admin-independent.sh
```

Este script:
1. ✅ Construye el admin independiente
2. ✅ Copia archivos a `/var/www/admin.neuralapp.cloud/`
3. ✅ Configura Nginx con SSL
4. ✅ Verifica el despliegue

## 📊 Beneficios de la Nueva Estructura

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

- **Panel Admin:** https://admin.neuralapp.cloud (completamente independiente)
- **Dashboard Doctor:** https://app.neuralapp.cloud (completamente independiente)
- **Servicios Compartidos:** `src/shared/` (utilidades comunes)
- **Builds Separados:** `dist-admin/` y `dist-doctor/`
- **Configuraciones Independientes:** Vite y TypeScript separados

¡La estructura está lista para producción! 🚀
