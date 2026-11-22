import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // This app is mounted at /manoj on its domain.
  base: '/manoj/',
  plugins: [react()],
  server: { port: 5174, strictPort: true },
})
