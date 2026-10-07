import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    base: process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH ?? '/',
    plugins: [react()],
    resolve: { alias: Object.fromEntries(['app', 'pages', 'widgets', 'features', 'entities', 'shared'].map(layer => ['@' + layer, fileURLToPath(new URL('./src/' + layer, import.meta.url))])) },
    server: { port: 3000 },
    build: { rollupOptions: { output: { manualChunks: { charts: ['recharts'], motion: ['framer-motion'], react: ['react', 'react-dom', 'react-router-dom'] } } } },
  };
});
