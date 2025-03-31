import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    host: true, // Permite acesso externo
    port: 5173, // Mantém a porta padrão do Vite
  },
});
