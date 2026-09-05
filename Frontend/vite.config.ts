import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  // Dice a Vite di andare a prendere il file .env nella cartella superiore (Root)
  envDir: '../',
  server: {
    open: true
  }
})
