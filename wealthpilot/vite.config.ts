import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiOrigin = new URL(process.env.VITE_API_BASE_URL ?? env.VITE_API_BASE_URL ?? 'https://montra-apis-w8pd.onrender.com/api/v1', 'https://montra-apis-w8pd.onrender.com').origin;
  const proxy = { '/health': { target: apiOrigin, changeOrigin: true }, '/api/v1': { target: apiOrigin, changeOrigin: true, cookieDomainRewrite: '' } };
  return {
    base: process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH ?? '/',
    plugins: [react()],
    resolve: { alias: Object.fromEntries(['app', 'pages', 'widgets', 'features', 'entities', 'shared'].map(layer => ['@' + layer, fileURLToPath(new URL('./src/' + layer, import.meta.url))])) },
    server: { port: 3000, proxy },
    preview: { proxy },
    build: { rollupOptions: { output: { manualChunks: { charts: ['recharts'], motion: ['framer-motion'], react: ['react', 'react-dom', 'react-router-dom'] } } } },
  };
});
