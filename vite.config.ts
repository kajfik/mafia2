import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mafia2/', // for GitHub Pages
  server: {
    host: true,   // exposes to your LAN
  },
})
