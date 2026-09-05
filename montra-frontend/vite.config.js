import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  // Production me GitHub repo name aur local me root path
  base: command === 'build' ? '/Montra-Money-Manager/' : '/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    open: true,
  },
}));