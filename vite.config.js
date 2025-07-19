import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// 🚨 CONFIGURACIÓN EMERGENCIA VITE
// Configuración absolutamente robusta que IGNORE variables de entorno problemáticas

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
  // 🚨 ELIMINAMOS define: completamente para evitar conflictos
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
        // 🚨 CRÍTICO: NO tocar console logs
        drop_console: false,
        drop_debugger: false,
        // No optimizar demasiado
        passes: 1,
        pure_getters: false,
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
  // 🚨 Configuración adicional para debug
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
