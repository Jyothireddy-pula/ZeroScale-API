import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    host: true
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  }
})
