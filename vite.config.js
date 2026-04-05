import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs; build goes to `docs/` so Pages can use “Deploy from branch → /docs”
  // and never publish the dev `index.html` at repo root.
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
