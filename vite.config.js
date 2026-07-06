import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `global: 'globalThis'` + the Buffer polyfill in main.jsx are required for the
// Solana wallet adapter, which expects a Node-style global + Buffer in browser.
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Some Solana deps import the bare `buffer` specifier.
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})
