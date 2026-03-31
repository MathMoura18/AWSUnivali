import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const env = 'production';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/AWSUnivali/',
})
