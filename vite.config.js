import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative paths so `dist/index.html` works when opened via file:// and on GitHub Pages root.
  base: './',
})
