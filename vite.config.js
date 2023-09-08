import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@tensorflow/tfjs', '@tensorflow-models/mobilenet']
    },
    // This is used to prevent warning during development
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
