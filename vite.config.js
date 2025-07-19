import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3002,
    host: true,
    open: true,
    strictPort: true,
  },
  // 🔧 CONFIGURACIÓN OPTIMIZADA PARA VARIABLES DE ENTORNO
  define: {
    // Forzar variables de entorno en build
    __VITE_SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://bwgnmastihgndmtbqvkj.supabase.co'),
    __VITE_SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['lucide-react', 'recharts'],
        }
      }
    },
    terserOptions: {
      compress: {
        // 🚨 CRÍTICO: NO eliminar console en producción para debug
        drop_console: false,
        drop_debugger: true,
        // Preservar variables de entorno
        keep_fnames: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'lucide-react', 
      'react', 
      'react-dom', 
      '@supabase/supabase-js',
      'recharts',
      'react-router-dom'
    ],
  },
});
