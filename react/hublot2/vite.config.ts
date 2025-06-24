import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // "server" is used when running via "npm run dev".
  server: {
    port: 3000,
    strictPort: true,
  },
  // "preview" is used when running via "npm run preview"
  preview: {
    port: 8080,
    strictPort: true,
  },
})
