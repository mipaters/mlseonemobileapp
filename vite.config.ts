import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Large static video assets don't need HMR and can trigger
      // transient EBUSY errors on Windows right after being copied in.
      ignored: ['**/public/videos/**'],
    },
  },
})
