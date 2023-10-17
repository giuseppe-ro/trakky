import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { resolve } from 'path'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/api': {
            target: process.env.VITE_API_BASE_URL,
            changeOrigin: true,
        },
    },
},
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
