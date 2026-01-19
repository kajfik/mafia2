import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const manualChunks = (id: string) => {
  const normalizedId = id.replace(/\\/g, '/')

  if (normalizedId.includes('node_modules')) {
    if (normalizedId.includes('/react/')) {
      return 'vendor-react'
    }
    if (normalizedId.includes('/scheduler/')) {
      return 'vendor-react'
    }
    if (normalizedId.includes('/qrcode')) {
      return 'vendor-visuals'
    }
    return 'vendor'
  }

  if (normalizedId.includes('/src/game/translations/')) {
    const match = normalizedId.match(/translations\/([A-Za-z]+)/)
    if (match?.[1]) {
      return `lang-${match[1].toLowerCase()}`
    }
    return 'lang-shared'
  }

  if (normalizedId.includes('/src/game/')) {
    return 'game-core'
  }

  if (normalizedId.includes('/src/components/')) {
    return 'ui-shared'
  }

  return undefined
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mafia2/', // for GitHub Pages
  server: {
    host: true, // exposes to your LAN
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
})
