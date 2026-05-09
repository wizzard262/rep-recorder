import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/your-repo-name/",
  build: {
    sourcemap: true
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["recharts"]
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
