import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuración específica para el Dashboard de Doctores
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "dist-doctor",
    rollupOptions: {
      input: "./src/doctor/mainDoctor.tsx",
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
    port: 5174,
    host: true,
  },
  preview: {
    port: 4174,
    host: true,
  },
});
