#!/bin/bash

# Script de despliegue para el Panel Admin integrado
# Despliega el Panel Admin integrado a app.neuralapp.cloud/admin/

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
MAIN_DOMAIN="app.neuralapp.cloud"
ADMIN_PATH="/admin"
ADMIN_DIR="/var/www/$MAIN_DOMAIN$ADMIN_PATH"
BUILD_DIR="dist-admin"

print_message "Iniciando despliegue del Panel Admin integrado..."

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
VITE_ADMIN_FRONTEND_URL=https://app.neuralapp.cloud/admin
VITE_DOCTOR_DASHBOARD_URL=https://app.neuralapp.cloud
EOF

# 4. Build del admin integrado
print_message "Construyendo Panel Admin integrado..."
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

# 10. Configurar Nginx para servir el admin en /admin/
print_message "Configurando Nginx para servir admin en /admin/..."

# Verificar si ya existe configuración para app.neuralapp.cloud
NGINX_CONFIG="/etc/nginx/sites-available/$MAIN_DOMAIN"
if [ -f "$NGINX_CONFIG" ]; then
    print_message "Configuración de Nginx existente encontrada, actualizando..."
    
    # Agregar configuración para /admin/ si no existe
    if ! grep -q "location /admin/" "$NGINX_CONFIG"; then
        sudo tee -a "$NGINX_CONFIG" > /dev/null << 'EOF'

    # Configuración para Panel Admin en /admin/
    location /admin/ {
        alias /var/www/app.neuralapp.cloud/admin/;
        try_files $uri $uri/ /admin/index.html;
        
        # Cache para archivos estáticos del admin
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy de API para admin
    location /api/admin/ {
        proxy_pass https://api.neuralapp.cloud/admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Configuración de CORS para admin
        add_header Access-Control-Allow-Origin "https://app.neuralapp.cloud" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
    }
EOF
        print_success "✅ Configuración de admin agregada a Nginx"
    else
        print_message "Configuración de admin ya existe en Nginx"
    fi
else
    print_message "Creando nueva configuración de Nginx..."
    
    sudo tee "$NGINX_CONFIG" > /dev/null << EOF
server {
    listen 80;
    server_name $MAIN_DOMAIN;

    root /var/www/$MAIN_DOMAIN;
    index index.html;

    # Headers de seguridad básicos
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Configuración principal del sitio
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache para archivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Configuración para Panel Admin en /admin/
    location /admin/ {
        alias /var/www/$MAIN_DOMAIN/admin/;
        try_files \$uri \$uri/ /admin/index.html;
        
        # Cache para archivos estáticos del admin
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy de API para admin
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
        
        # Configuración de CORS para admin
        add_header Access-Control-Allow-Origin "https://$MAIN_DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
    }

    # Configuración de logs
    access_log /var/log/nginx/$MAIN_DOMAIN.access.log;
    error_log /var/log/nginx/$MAIN_DOMAIN.error.log;

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
fi

# 11. Verificar configuración de Nginx
if sudo nginx -t; then
    print_success "✅ Configuración de Nginx válida"
else
    print_error "❌ Error en configuración de Nginx"
    exit 1
fi

# 12. Recargar Nginx
sudo systemctl reload nginx
print_success "✅ Nginx recargado"

# 13. Configurar SSL si no existe
if [ ! -f "/etc/letsencrypt/live/$MAIN_DOMAIN/fullchain.pem" ]; then
    print_message "Configurando certificado SSL..."
    sudo certbot --nginx -d "$MAIN_DOMAIN" --non-interactive --agree-tos --email admin@neuralapp.cloud
    print_success "✅ Certificado SSL configurado"
else
    print_success "✅ Certificado SSL ya existe"
fi

# 14. Verificación final
print_message "Realizando verificación final..."
if curl -f -s "https://$MAIN_DOMAIN$ADMIN_PATH/login" > /dev/null; then
    print_success "✅ Panel Admin accesible en https://$MAIN_DOMAIN$ADMIN_PATH/login"
else
    print_warning "⚠️ Panel Admin no accesible aún (puede tardar unos minutos)"
fi

# Resumen final
echo ""
print_success "🎉 Despliegue del Panel Admin integrado completado!"
echo ""
print_message "Panel Admin desplegado en: https://$MAIN_DOMAIN$ADMIN_PATH"
print_message "Login disponible en: https://$MAIN_DOMAIN$ADMIN_PATH/login"
print_message "Dashboard disponible en: https://$MAIN_DOMAIN$ADMIN_PATH/dashboard"
print_message "API proxy configurado en: https://$MAIN_DOMAIN/api/admin"
echo ""
print_message "Estructura integrada:"
print_message "✅ Admin: src/admin/ → dist-admin/ → https://app.neuralapp.cloud/admin"
print_message "✅ Doctor: src/doctor/ → dist-doctor/ → https://app.neuralapp.cloud"
print_message "✅ Mismo dominio con rutas separadas"
echo ""
print_message "El Panel Admin está completamente integrado y listo para usar."
