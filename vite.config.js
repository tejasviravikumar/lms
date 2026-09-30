import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep React and React DOM on one instance when packages resolve from both
  // frontend/node_modules and the repository-level node_modules.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
