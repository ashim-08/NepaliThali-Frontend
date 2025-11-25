import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://nepalithali-class11-ojt-backend-0ud5.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
