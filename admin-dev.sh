#!/bin/bash

# Script de desarrollo para el Panel de Administración NeuralApp
# Este script facilita el desarrollo y testing del panel admin

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_message() {
    echo -e "${BLUE}[ADMIN-PANEL]${NC} $1"
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

# Función para mostrar ayuda
show_help() {
    echo "Panel de Administración NeuralApp - Script de Desarrollo"
    echo ""
    echo "Uso: ./admin-dev.sh [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  setup     - Configurar entorno de desarrollo"
    echo "  dev       - Ejecutar servidor de desarrollo"
    echo "  build     - Construir para producción"
    echo "  test      - Ejecutar tests"
    echo "  lint      - Verificar código con ESLint"
    echo "  format    - Formatear código con Prettier"
    echo "  clean     - Limpiar archivos temporales"
    echo "  backup    - Crear backup del proyecto"
    echo "  deploy    - Desplegar a producción"
    echo "  logs      - Ver logs del sistema"
    echo "  help      - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./admin-dev.sh setup"
    echo "  ./admin-dev.sh dev"
    echo "  ./admin-dev.sh build"
}

# Función para configurar el entorno
setup_environment() {
    print_message "Configurando entorno de desarrollo del panel admin..."
    
    # Verificar si Node.js está instalado
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js 18+"
        exit 1
    fi
    
    # Verificar versión de Node.js
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js versión 18+ requerida. Versión actual: $(node -v)"
        exit 1
    fi
    
    # Instalar dependencias
    print_message "Instalando dependencias..."
    npm install
    
    # Crear archivo de configuración si no existe
    if [ ! -f ".env.local" ]; then
        print_message "Creando archivo de configuración..."
        cp admin.env.example .env.local
        print_warning "Configura las variables en .env.local"
    fi
    
    # Verificar estructura de carpetas
    print_message "Verificando estructura del proyecto..."
    mkdir -p src/modules/admin/{auth,dashboard,clinics,doctors,users,logs}
    mkdir -p src/pages/admin
    mkdir -p src/components/admin
    
    print_success "Entorno configurado correctamente"
}

# Función para ejecutar servidor de desarrollo
run_dev_server() {
    print_message "Iniciando servidor de desarrollo del panel admin..."
    print_message "Panel admin disponible en: http://localhost:5173/admin/login"
    print_message "Dashboard de doctores disponible en: http://localhost:5173/login"
    print_message "Presiona Ctrl+C para detener el servidor"
    echo ""
    
    npm run dev
}

# Función para construir para producción
build_production() {
    print_message "Construyendo panel admin para producción..."
    
    # Limpiar build anterior
    rm -rf dist/
    
    # Construir
    npm run build
    
    print_success "Build completado. Archivos en: dist/"
}

# Función para ejecutar tests
run_tests() {
    print_message "Ejecutando tests del panel admin..."
    
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm run test
    else
        print_warning "No hay scripts de test configurados"
    fi
}

# Función para verificar código
run_lint() {
    print_message "Verificando código con ESLint..."
    npm run lint
}

# Función para formatear código
format_code() {
    print_message "Formateando código..."
    
    if command -v prettier &> /dev/null; then
        prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"
        print_success "Código formateado"
    else
        print_warning "Prettier no está instalado. Instalando..."
        npm install -g prettier
        prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"
    fi
}

# Función para limpiar archivos temporales
clean_files() {
    print_message "Limpiando archivos temporales..."
    
    rm -rf dist/
    rm -rf node_modules/.cache/
    rm -rf .vite/
    
    print_success "Archivos temporales eliminados"
}

# Función para crear backup
create_backup() {
    print_message "Creando backup del proyecto..."
    
    BACKUP_NAME="neuralapp-admin-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Crear backup excluyendo node_modules y dist
    tar --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.git' \
        --exclude='*.log' \
        -czf "${BACKUP_NAME}.tar.gz" .
    
    print_success "Backup creado: ${BACKUP_NAME}.tar.gz"
}

# Función para ver logs
view_logs() {
    print_message "Logs del sistema del panel admin..."
    
    if [ -f "logs/admin.log" ]; then
        tail -f logs/admin.log
    else
        print_warning "No hay archivo de logs encontrado"
    fi
}

# Función para desplegar
deploy_production() {
    print_message "Desplegando panel admin a producción..."
    
    # Verificar que estamos en la rama correcta
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "admin-integration" ]; then
        print_warning "Cambiando a rama admin-integration..."
        git checkout admin-integration
    fi
    
    # Construir para producción
    build_production
    
    # Aquí irían los comandos de despliegue específicos
    print_message "Subiendo cambios a GitHub..."
    git add .
    git commit -m "deploy: Desplegar panel admin a producción" || true
    git push origin admin-integration
    
    print_success "Despliegue completado"
}

# Función principal
main() {
    case "${1:-help}" in
        setup)
            setup_environment
            ;;
        dev)
            run_dev_server
            ;;
        build)
            build_production
            ;;
        test)
            run_tests
            ;;
        lint)
            run_lint
            ;;
        format)
            format_code
            ;;
        clean)
            clean_files
            ;;
        backup)
            create_backup
            ;;
        deploy)
            deploy_production
            ;;
        logs)
            view_logs
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
