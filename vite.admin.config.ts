import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuración específica para el Panel Admin integrado
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "dist-admin",
    emptyOutDir: true,
    rollupOptions: {
      input: "./src/admin/mainAdmin.tsx",
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
  },
  define: {
    "process.env": process.env,
  },
  server: {
    port: 5175,
    host: true,
  },
  preview: {
    port: 4175,
    host: true,
  },
});