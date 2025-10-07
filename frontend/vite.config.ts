import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig((config: UserConfig) => ({
  plugins: [react(), tailwindcss()],
  build: {
    minify: config.mode === 'production',
  },
}))
