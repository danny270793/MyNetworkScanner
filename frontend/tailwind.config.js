import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  // Ensure dark mode is properly configured
  corePlugins: {
    preflight: true,
  },
})
