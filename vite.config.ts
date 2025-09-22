import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ai-made-c6bank-csv-creditcard-report/',
  build: {
    outDir: 'docs'
  }
})
