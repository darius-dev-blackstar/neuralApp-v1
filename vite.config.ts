import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determinar la URL de la API basada en el modo
  const apiUrl = mode === 'development' 
    ? 'http://localhost:3000' 
    : (process.env.VITE_API_URL || 'https://api.neuralapp.cloud');

  console.log(`🔧 Configurando API URL para modo ${mode}: ${apiUrl}`);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Definir variables de entorno por defecto
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
  };
});
