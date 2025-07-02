import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/mousefun/' : '/'; // Conditional base path

  return {
    base, // Use the conditional base path
    plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
})
