import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// If you deploy into a subfolder (e.g. https://site.com/calc/), set `base` to '/calc/'.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
