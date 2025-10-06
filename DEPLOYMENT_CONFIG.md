# Configuración de Despliegue para admin.neuralapp.cloud
# Este archivo contiene la configuración necesaria para desplegar el panel admin

# =============================================================================
# CONFIGURACIÓN DE NGINX PARA ADMIN.NEURALAPP.CLOUD
# =============================================================================

# Archivo: /etc/nginx/sites-available/admin.neuralapp.cloud
server {
    listen 80;
    listen [::]:80;
    server_name admin.neuralapp.cloud;
    
    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.neuralapp.cloud;

    # Configuración SSL
    ssl_certificate /etc/letsencrypt/live/admin.neuralapp.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.neuralapp.cloud/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.neuralapp.cloud; frame-ancestors 'none';" always;

    # Directorio raíz del panel admin
    root /var/www/neuralapp/admin-frontend/dist-admin;
    index index.html;

    # Configuración de archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
        
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Configuración de CORS
        add_header Access-Control-Allow-Origin "https://admin.neuralapp.cloud" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Manejar preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://admin.neuralapp.cloud";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With";
            add_header Access-Control-Allow-Credentials "true";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }

    # Configuración de logs
    access_log /var/log/nginx/admin.neuralapp.cloud.access.log;
    error_log /var/log/nginx/admin.neuralapp.cloud.error.log;

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

# =============================================================================
# CONFIGURACIÓN DE DOCKER PARA ADMIN.NEURALAPP.CLOUD
# =============================================================================

# Archivo: Dockerfile.admin
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:admin

FROM nginx:alpine
COPY --from=builder /app/dist-admin /usr/share/nginx/html
COPY nginx.admin.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# CONFIGURACIÓN DE DOCKER COMPOSE
# =============================================================================

# Archivo: docker-compose.admin.yml
version: '3.8'

services:
  admin-frontend:
    build:
      context: .
      dockerfile: Dockerfile.admin
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.admin.rule=Host(`admin.neuralapp.cloud`)"
      - "traefik.http.routers.admin.tls=true"
      - "traefik.http.routers.admin.tls.certresolver=letsencrypt"

# =============================================================================
# CONFIGURACIÓN DE VARIABLES DE ENTORNO PARA PRODUCCIÓN
# =============================================================================

# Archivo: .env.production.admin
VITE_NODE_ENV=production
VITE_ADMIN_API_URL=https://api.neuralapp.cloud/admin
VITE_ADMIN_FRONTEND_URL=https://admin.neuralapp.cloud
VITE_DOCTOR_DASHBOARD_URL=https://neuralapp.cloud
VITE_APP_DOMAIN=neuralapp.cloud
VITE_ADMIN_SUBDOMAIN=admin.neuralapp.cloud

# Configuración de autenticación
VITE_JWT_SECRET=${JWT_SECRET}
VITE_TOKEN_EXPIRY=24h

# Configuración de seguridad
VITE_ENABLE_AUDIT_LOGS=true
VITE_LOG_RETENTION_DAYS=90
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION_MINUTES=30

# Configuración de monitoreo
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=${ANALYTICS_ID}

# =============================================================================
# SCRIPT DE DESPLIEGUE
# =============================================================================

#!/bin/bash
# Archivo: deploy-admin.sh

set -e

echo "🚀 Desplegando Panel Admin a admin.neuralapp.cloud..."

# Variables
ADMIN_DIR="/var/www/neuralapp/admin-frontend"
BACKUP_DIR="/var/www/neuralapp/backups/admin"
DATE=$(date +%Y%m%d-%H%M%S)

# Crear backup del despliegue anterior
if [ -d "$ADMIN_DIR" ]; then
    echo "📦 Creando backup del despliegue anterior..."
    mkdir -p "$BACKUP_DIR"
    tar -czf "$BACKUP_DIR/admin-backup-$DATE.tar.gz" -C "$ADMIN_DIR" .
fi

# Construir el panel admin
echo "🔨 Construyendo panel admin..."
npm run build:admin

# Crear directorio de despliegue
echo "📁 Preparando directorio de despliegue..."
sudo mkdir -p "$ADMIN_DIR"
sudo chown -R www-data:www-data "$ADMIN_DIR"

# Copiar archivos construidos
echo "📋 Copiando archivos..."
sudo cp -r dist-admin/* "$ADMIN_DIR/"

# Configurar permisos
echo "🔐 Configurando permisos..."
sudo chown -R www-data:www-data "$ADMIN_DIR"
sudo chmod -R 755 "$ADMIN_DIR"

# Recargar configuración de Nginx
echo "🔄 Recargando configuración de Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# Verificar despliegue
echo "✅ Verificando despliegue..."
curl -f https://admin.neuralapp.cloud > /dev/null && echo "✅ Panel admin desplegado correctamente" || echo "❌ Error en el despliegue"

echo "🎉 Despliegue completado!"
