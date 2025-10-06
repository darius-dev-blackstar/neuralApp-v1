#!/bin/bash

# Script de despliegue para el Panel Admin en admin.neuralapp.cloud
# Este script automatiza el proceso de despliegue del panel admin

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_message() {
    echo -e "${BLUE}[ADMIN-DEPLOY]${NC} $1"
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

# Variables de configuración
ADMIN_DOMAIN="admin.neuralapp.cloud"
API_DOMAIN="api.neuralapp.cloud"
ADMIN_DIR="/var/www/neuralapp/admin-frontend"
BACKUP_DIR="/var/www/neuralapp/backups/admin"
DATE=$(date +%Y%m%d-%H%M%S)

# Función para mostrar ayuda
show_help() {
    echo "Script de Despliegue del Panel Admin - NeuralApp"
    echo ""
    echo "Uso: ./deploy-admin.sh [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build      - Construir el panel admin para producción"
    echo "  deploy     - Desplegar a admin.neuralapp.cloud"
    echo "  backup     - Crear backup del despliegue actual"
    echo "  restore    - Restaurar desde backup"
    echo "  test       - Probar el despliegue"
    echo "  logs       - Ver logs del servidor"
    echo "  ssl        - Configurar certificados SSL"
    echo "  nginx      - Configurar Nginx"
    echo "  full       - Despliegue completo (build + deploy + test)"
    echo "  help       - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./deploy-admin.sh build"
    echo "  ./deploy-admin.sh deploy"
    echo "  ./deploy-admin.sh full"
}

# Función para construir el panel admin
build_admin() {
    print_message "Construyendo panel admin para producción..."
    
    # Verificar que estamos en la rama correcta
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "admin-integration" ]; then
        print_warning "Cambiando a rama admin-integration..."
        git checkout admin-integration
    fi
    
    # Instalar dependencias
    print_message "Instalando dependencias..."
    npm ci --only=production
    
    # Construir el panel admin
    print_message "Construyendo panel admin..."
    npm run build:admin
    
    # Verificar que el build fue exitoso
    if [ ! -d "dist-admin" ]; then
        print_error "Error: Directorio dist-admin no encontrado"
        exit 1
    fi
    
    print_success "Build completado exitosamente"
}

# Función para crear backup
create_backup() {
    print_message "Creando backup del despliegue actual..."
    
    if [ -d "$ADMIN_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        tar -czf "$BACKUP_DIR/admin-backup-$DATE.tar.gz" -C "$ADMIN_DIR" .
        print_success "Backup creado: $BACKUP_DIR/admin-backup-$DATE.tar.gz"
    else
        print_warning "No hay despliegue anterior para respaldar"
    fi
}

# Función para desplegar
deploy_admin() {
    print_message "Desplegando panel admin a $ADMIN_DOMAIN..."
    
    # Crear backup antes del despliegue
    create_backup
    
    # Crear directorio de despliegue
    print_message "Preparando directorio de despliegue..."
    sudo mkdir -p "$ADMIN_DIR"
    sudo chown -R www-data:www-data "$ADMIN_DIR"
    
    # Copiar archivos construidos
    print_message "Copiando archivos del panel admin..."
    sudo cp -r dist-admin/* "$ADMIN_DIR/"
    
    # Configurar permisos
    print_message "Configurando permisos..."
    sudo chown -R www-data:www-data "$ADMIN_DIR"
    sudo chmod -R 755 "$ADMIN_DIR"
    
    # Crear archivo de configuración de entorno
    print_message "Configurando variables de entorno..."
    sudo tee "$ADMIN_DIR/.env" > /dev/null << EOF
VITE_NODE_ENV=production
VITE_ADMIN_API_URL=https://$API_DOMAIN/admin
VITE_ADMIN_FRONTEND_URL=https://$ADMIN_DOMAIN
VITE_DOCTOR_DASHBOARD_URL=https://neuralapp.cloud
VITE_APP_DOMAIN=neuralapp.cloud
VITE_ADMIN_SUBDOMAIN=$ADMIN_DOMAIN
EOF
    
    print_success "Despliegue completado"
}

# Función para configurar Nginx
configure_nginx() {
    print_message "Configurando Nginx para $ADMIN_DOMAIN..."
    
    # Crear configuración de Nginx
    sudo tee /etc/nginx/sites-available/$ADMIN_DOMAIN > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $ADMIN_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $ADMIN_DOMAIN;

    # Configuración SSL
    ssl_certificate /etc/letsencrypt/live/$ADMIN_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$ADMIN_DOMAIN/privkey.pem;
    
    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Directorio raíz del panel admin
    root $ADMIN_DIR;
    index index.html;

    # Configuración de archivos estáticos
    location / {
        try_files \$uri \$uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Configuración de API (proxy al backend)
    location /api/admin/ {
        proxy_pass https://$API_DOMAIN/admin/;
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
}
EOF
    
    # Habilitar el sitio
    sudo ln -sf /etc/nginx/sites-available/$ADMIN_DOMAIN /etc/nginx/sites-enabled/
    
    # Verificar configuración
    sudo nginx -t
    
    print_success "Configuración de Nginx completada"
}

# Función para configurar SSL
configure_ssl() {
    print_message "Configurando certificados SSL para $ADMIN_DOMAIN..."
    
    # Instalar certbot si no está instalado
    if ! command -v certbot &> /dev/null; then
        print_message "Instalando certbot..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Obtener certificado SSL
    sudo certbot --nginx -d $ADMIN_DOMAIN --non-interactive --agree-tos --email admin@neuralapp.cloud
    
    print_success "Certificados SSL configurados"
}

# Función para probar el despliegue
test_deployment() {
    print_message "Probando despliegue de $ADMIN_DOMAIN..."
    
    # Verificar que el sitio responde
    if curl -f -s https://$ADMIN_DOMAIN > /dev/null; then
        print_success "✅ Panel admin accesible en https://$ADMIN_DOMAIN"
    else
        print_error "❌ Error: Panel admin no accesible"
        return 1
    fi
    
    # Verificar que el login funciona
    if curl -f -s https://$ADMIN_DOMAIN/admin/login > /dev/null; then
        print_success "✅ Página de login accesible"
    else
        print_error "❌ Error: Página de login no accesible"
        return 1
    fi
    
    # Verificar headers de seguridad
    print_message "Verificando headers de seguridad..."
    SECURITY_HEADERS=$(curl -I -s https://$ADMIN_DOMAIN | grep -E "(Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options)")
    if [ -n "$SECURITY_HEADERS" ]; then
        print_success "✅ Headers de seguridad configurados"
    else
        print_warning "⚠️ Headers de seguridad no encontrados"
    fi
    
    print_success "Pruebas de despliegue completadas"
}

# Función para ver logs
view_logs() {
    print_message "Mostrando logs del servidor..."
    
    echo "=== Logs de acceso de Nginx ==="
    sudo tail -n 20 /var/log/nginx/$ADMIN_DOMAIN.access.log
    
    echo ""
    echo "=== Logs de error de Nginx ==="
    sudo tail -n 20 /var/log/nginx/$ADMIN_DOMAIN.error.log
    
    echo ""
    echo "=== Estado del servicio Nginx ==="
    sudo systemctl status nginx --no-pager
}

# Función para restaurar desde backup
restore_backup() {
    print_message "Restaurando desde backup..."
    
    if [ -z "$1" ]; then
        print_error "Especifica el archivo de backup a restaurar"
        echo "Backups disponibles:"
        ls -la "$BACKUP_DIR"
        return 1
    fi
    
    BACKUP_FILE="$BACKUP_DIR/$1"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Archivo de backup no encontrado: $BACKUP_FILE"
        return 1
    fi
    
    print_message "Restaurando desde $BACKUP_FILE..."
    sudo tar -xzf "$BACKUP_FILE" -C "$ADMIN_DIR"
    sudo chown -R www-data:www-data "$ADMIN_DIR"
    
    print_success "Restauración completada"
}

# Función para despliegue completo
full_deployment() {
    print_message "Iniciando despliegue completo del panel admin..."
    
    build_admin
    deploy_admin
    configure_nginx
    sudo systemctl reload nginx
    test_deployment
    
    print_success "🎉 Despliegue completo exitoso!"
    print_message "Panel admin disponible en: https://$ADMIN_DOMAIN"
}

# Función principal
main() {
    case "${1:-help}" in
        build)
            build_admin
            ;;
        deploy)
            deploy_admin
            ;;
        backup)
            create_backup
            ;;
        restore)
            restore_backup "$2"
            ;;
        test)
            test_deployment
            ;;
        logs)
            view_logs
            ;;
        ssl)
            configure_ssl
            ;;
        nginx)
            configure_nginx
            ;;
        full)
            full_deployment
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Comando no reconocido: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
