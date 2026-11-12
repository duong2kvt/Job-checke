import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /<repo>/; override with BASE_PATH when hosting elsewhere.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/Job-checke/',
  plugins: [react()],
})
