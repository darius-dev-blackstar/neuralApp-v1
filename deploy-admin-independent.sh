#!/bin/bash

# Script de despliegue para la nueva estructura independiente
# Despliega el Panel Admin independiente a admin.neuralapp.cloud

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_message() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Variables
ADMIN_DOMAIN="admin.neuralapp.cloud"
ADMIN_DIR="/var/www/$ADMIN_DOMAIN"
BUILD_DIR="dist-admin"

print_message "Iniciando despliegue del Panel Admin independiente..."

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# 2. Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    print_message "Instalando dependencias..."
    npm install
fi

# 3. Crear archivo .env para producción
print_message "Configurando variables de entorno..."
cat > .env << EOF
VITE_API_URL=https://api.neuralapp.cloud/admin
VITE_ENV=production
VITE_ADMIN_FRONTEND_URL=https://admin.neuralapp.cloud
VITE_DOCTOR_DASHBOARD_URL=https://app.neuralapp.cloud
EOF

# 4. Build del admin independiente
print_message "Construyendo Panel Admin independiente..."
npm run build:admin

# 5. Verificar que el build se completó
if [ ! -d "$BUILD_DIR" ]; then
    print_error "El build del admin no se completó correctamente."
    exit 1
fi

print_success "Build del admin completado exitosamente"

# 6. Crear directorio de destino
print_message "Preparando directorio de destino..."
sudo mkdir -p "$ADMIN_DIR"

# 7. Copiar archivos del build
print_message "Copiando archivos del build..."
sudo cp -r "$BUILD_DIR"/* "$ADMIN_DIR/"

# 8. Configurar permisos
print_message "Configurando permisos..."
sudo chown -R www-data:www-data "$ADMIN_DIR"
sudo chmod -R 755 "$ADMIN_DIR"

# 9. Verificar archivos copiados
print_message "Verificando archivos copiados..."
if [ -f "$ADMIN_DIR/index.html" ]; then
    print_success "✅ index.html copiado correctamente"
else
    print_error "❌ Error: index.html no encontrado"
    exit 1
fi

if [ -d "$ADMIN_DIR/assets" ]; then
    print_success "✅ Directorio assets copiado correctamente"
else
    print_error "❌ Error: Directorio assets no encontrado"
    exit 1
fi

# 10. Configurar Nginx (si no está configurado)
NGINX_CONFIG="/etc/nginx/sites-available/$ADMIN_DOMAIN"
if [ ! -f "$NGINX_CONFIG" ]; then
    print_message "Configurando Nginx..."
    
    sudo tee "$NGINX_CONFIG" > /dev/null << EOF
server {
    listen 80;
    server_name $ADMIN_DOMAIN;

    root $ADMIN_DIR;
    index index.html;

    # Headers de seguridad básicos
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Configuración de archivos estáticos
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache para archivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Configuración de API (proxy al backend)
    location /api/admin/ {
        proxy_pass https://api.neuralapp.cloud/admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Configuración de CORS
        add_header Access-Control-Allow-Origin "https://$ADMIN_DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
    }

    # Configuración de logs
    access_log /var/log/nginx/$ADMIN_DOMAIN.access.log;
    error_log /var/log/nginx/$ADMIN_DOMAIN.error.log;

    # Configuración de compresión
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

    # Habilitar el sitio
    sudo ln -sf "$NGINX_CONFIG" "/etc/nginx/sites-enabled/"
    
    # Verificar configuración
    if sudo nginx -t; then
        print_success "✅ Configuración de Nginx válida"
    else
        print_error "❌ Error en configuración de Nginx"
        exit 1
    fi
    
    # Recargar Nginx
    sudo systemctl reload nginx
    print_success "✅ Nginx recargado"
else
    print_message "Nginx ya configurado, recargando..."
    sudo systemctl reload nginx
fi

# 11. Configurar SSL si no existe
if [ ! -f "/etc/letsencrypt/live/$ADMIN_DOMAIN/fullchain.pem" ]; then
    print_message "Configurando certificado SSL..."
    sudo certbot --nginx -d "$ADMIN_DOMAIN" --non-interactive --agree-tos --email admin@neuralapp.cloud
    print_success "✅ Certificado SSL configurado"
else
    print_success "✅ Certificado SSL ya existe"
fi

# 12. Verificación final
print_message "Realizando verificación final..."
if curl -f -s "https://$ADMIN_DOMAIN" > /dev/null; then
    print_success "✅ Panel Admin accesible en https://$ADMIN_DOMAIN"
else
    print_warning "⚠️ Panel Admin no accesible aún (puede tardar unos minutos)"
fi

# Resumen final
echo ""
print_success "🎉 Despliegue del Panel Admin independiente completado!"
echo ""
print_message "Panel Admin desplegado en: https://$ADMIN_DOMAIN"
print_message "Login disponible en: https://$ADMIN_DOMAIN/admin/login"
print_message "Dashboard disponible en: https://$ADMIN_DOMAIN/admin/dashboard"
print_message "API proxy configurado en: https://$ADMIN_DOMAIN/api/admin"
echo ""
print_message "Estructura independiente:"
print_message "✅ Admin: src/admin/ → dist-admin/ → https://admin.neuralapp.cloud"
print_message "✅ Doctor: src/doctor/ → dist-doctor/ → https://app.neuralapp.cloud"
print_message "✅ Shared: src/shared/ → Utilidades comunes"
echo ""
print_message "El Panel Admin está completamente independiente y listo para usar."
