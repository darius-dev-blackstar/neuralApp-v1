import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isAdminBuild = process.env.BUILD_TARGET === 'admin';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    // Configuración específica para el panel admin
    define: {
      __ADMIN_BUILD__: isAdminBuild,
      __PRODUCTION__: isProduction,
    },

    // Configuración del servidor de desarrollo
    server: {
      port: 5173,
      host: true,
      // Configurar CORS para desarrollo
      cors: {
        origin: [
          'http://localhost:5173',
          'http://localhost:3000',
          'http://localhost:3001',
          'https://admin.neuralapp.cloud',
          'https://neuralapp.cloud'
        ],
        credentials: true,
      },
    },

    // Configuración de preview (para testing local)
    preview: {
      port: 4173,
      host: true,
      cors: {
        origin: [
          'http://localhost:4173',
          'https://admin.neuralapp.cloud',
          'https://neuralapp.cloud'
        ],
        credentials: true,
      },
    },

    // Configuración de build
    build: {
      outDir: isAdminBuild ? 'dist-admin' : 'dist',
      sourcemap: !isProduction,
      
      // Configuración de chunks para optimización
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar vendor chunks
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            admin: isAdminBuild ? [
              './src/services/adminAuth.ts',
              './src/config/adminConfig.ts',
              './src/components/admin/AdminLayout.tsx',
              './src/pages/admin/AdminLogin.tsx',
              './src/pages/admin/AdminDashboard.tsx'
            ] : [],
          },
        },
      },

      // Configuración de assets
      assetsDir: 'assets',
      
      // Configuración de minificación
      minify: isProduction ? 'esbuild' : false,
    },

    // Configuración de variables de entorno
    envPrefix: 'VITE_',

    // Configuración de CSS
    css: {
      devSourcemap: !isProduction,
    },

    // Configuración de optimización de dependencias
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        '@tanstack/react-query',
        'lucide-react',
        'sonner',
      ],
    },
  };
});
