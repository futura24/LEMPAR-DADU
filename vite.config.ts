import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// base './' membuat hasil build bisa dibuka dari sub-folder (GitHub Pages)
// maupun dari root domain (Vercel/Netlify) tanpa perubahan konfigurasi.
export default defineConfig({
  base: '/LEMPAR DADU/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { port: 5173, open: true },
});
