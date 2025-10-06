# Despliegue del Panel Admin en admin.neuralapp.cloud

## 🎯 Objetivo

Configurar el panel de administración de NeuralApp para que funcione bajo el subdominio `admin.neuralapp.cloud`, completamente separado del dashboard de doctores.

## 🔧 Configuración Implementada

### ✅ Frontend
- **URLs dinámicas** según el entorno (desarrollo/producción)
- **Almacenamiento separado** del dashboard de doctores
- **Rutas configuradas** para el subdominio
- **Autenticación JWT** con claves específicas del admin
- **Build optimizado** para producción

### ✅ Backend (Preparado)
- **CORS configurado** para aceptar solo `admin.neuralapp.cloud`
- **Variables de entorno** separadas
- **Cookies y JWT** configurados para el subdominio
- **Headers de seguridad** implementados

### ✅ Despliegue
- **Script automatizado** de despliegue
- **Configuración de Nginx** completa
- **Certificados SSL** preparados
- **Backup automático** antes del despliegue

## 🚀 Cómo Desplegar

### 1. **Preparación del Servidor**

```bash
# Instalar dependencias del sistema
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Crear directorio del panel admin
sudo mkdir -p /var/www/neuralapp/admin-frontend
sudo chown -R www-data:www-data /var/www/neuralapp/admin-frontend
```

### 2. **Configurar DNS**

```bash
# Agregar registro A para admin.neuralapp.cloud
# Apuntar a la IP del servidor donde está el panel admin
admin.neuralapp.cloud.    A    YOUR_SERVER_IP
```

### 3. **Despliegue Automático**

```bash
# Ejecutar despliegue completo
./deploy-admin.sh full

# O paso a paso:
./deploy-admin.sh build      # Construir el panel admin
./deploy-admin.sh deploy     # Desplegar archivos
./deploy-admin.sh nginx      # Configurar Nginx
./deploy-admin.sh ssl        # Configurar SSL
./deploy-admin.sh test       # Probar despliegue
```

### 4. **Verificación**

```bash
# Verificar que el panel admin funciona
curl -f https://admin.neuralapp.cloud/admin/login

# Verificar headers de seguridad
curl -I https://admin.neuralapp.cloud
```

## 🔐 Configuración de Seguridad

### **Separación Total de Datos**
- ✅ **Almacenamiento local** separado (`neuralapp_admin_*`)
- ✅ **Cookies** con dominio específico
- ✅ **Tokens JWT** independientes
- ✅ **Sin acceso** a datos clínicos

### **Headers de Seguridad**
```nginx
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### **CORS Configurado**
```nginx
Access-Control-Allow-Origin: https://admin.neuralapp.cloud
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With
Access-Control-Allow-Credentials: true
```

## 📁 Estructura de Archivos

```
/var/www/neuralapp/admin-frontend/
├── index.html                 # Página principal del admin
├── assets/                    # Archivos estáticos
│   ├── index-*.css           # Estilos del admin
│   ├── admin-*.js            # Código específico del admin
│   ├── vendor-*.js           # Dependencias
│   └── router-*.js           # Router del admin
└── .env                      # Variables de entorno
```

## 🔄 Scripts Disponibles

### **Desarrollo**
```bash
npm run dev:admin              # Servidor de desarrollo del admin
npm run build:admin            # Build del admin para producción
npm run preview:admin          # Preview del build del admin
```

### **Despliegue**
```bash
./deploy-admin.sh build        # Construir para producción
./deploy-admin.sh deploy       # Desplegar archivos
./deploy-admin.sh backup       # Crear backup
./deploy-admin.sh restore      # Restaurar desde backup
./deploy-admin.sh test         # Probar despliegue
./deploy-admin.sh logs         # Ver logs del servidor
./deploy-admin.sh full         # Despliegue completo
```

## 🌐 URLs de Acceso

### **Producción**
- **Panel Admin:** https://admin.neuralapp.cloud
- **Login Admin:** https://admin.neuralapp.cloud/admin/login
- **Dashboard Admin:** https://admin.neuralapp.cloud/admin/dashboard
- **API Admin:** https://api.neuralapp.cloud/admin

### **Desarrollo**
- **Panel Admin:** http://localhost:5173/admin
- **Login Admin:** http://localhost:5173/admin/login
- **API Admin:** http://localhost:3001/api/admin

## 🔍 Monitoreo y Logs

### **Logs de Nginx**
```bash
# Ver logs de acceso
sudo tail -f /var/log/nginx/admin.neuralapp.cloud.access.log

# Ver logs de error
sudo tail -f /var/log/nginx/admin.neuralapp.cloud.error.log
```

### **Logs de la Aplicación**
```bash
# Ver logs del panel admin
./deploy-admin.sh logs
```

## 🛠️ Mantenimiento

### **Actualización del Panel**
```bash
# 1. Hacer backup
./deploy-admin.sh backup

# 2. Actualizar código
git pull origin admin-integration

# 3. Reconstruir y redesplegar
./deploy-admin.sh full
```

### **Restauración de Emergencia**
```bash
# Listar backups disponibles
ls -la /var/www/neuralapp/backups/admin/

# Restaurar desde backup específico
./deploy-admin.sh restore admin-backup-20240115-143000.tar.gz
```

## ⚠️ Consideraciones Importantes

### **Seguridad**
- ✅ **Nunca** mezclar datos del admin con datos clínicos
- ✅ **Validar** que el CORS solo acepta el subdominio correcto
- ✅ **Monitorear** logs de acceso y errores
- ✅ **Mantener** certificados SSL actualizados

### **Rendimiento**
- ✅ **Cache** configurado para archivos estáticos
- ✅ **Compresión** gzip habilitada
- ✅ **CDN** recomendado para archivos estáticos
- ✅ **Monitoreo** de uptime del servicio

### **Backup**
- ✅ **Backup automático** antes de cada despliegue
- ✅ **Retención** de backups por 30 días
- ✅ **Pruebas** de restauración periódicas

## 🎉 Resultado Final

Una vez desplegado correctamente, tendrás:

- ✅ **Panel admin** accesible en https://admin.neuralapp.cloud
- ✅ **Login seguro** con roles admin/operator
- ✅ **Dashboard** con KPIs administrativos
- ✅ **Separación total** del dashboard de doctores
- ✅ **Seguridad** implementada en todas las capas
- ✅ **Monitoreo** y logs operativos
- ✅ **Backup** y restauración automatizados

¡El panel admin está listo para producción en admin.neuralapp.cloud! 🚀
