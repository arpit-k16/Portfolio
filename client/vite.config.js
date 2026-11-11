import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, API calls go to the Express server on :5000.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // `npm run build:demo` makes a server-free preview that works from any folder.
  base: mode === 'demo' ? './' : '/',
  define: mode === 'demo' ? { 'import.meta.env.VITE_DEMO': JSON.stringify('1') } : {},
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
}));
