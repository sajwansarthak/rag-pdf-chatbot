import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      "/create-document": "http://localhost:3000",
      "/upload": "http://localhost:3000",
      "/ask": "http://localhost:3000",
    },
  },
})
