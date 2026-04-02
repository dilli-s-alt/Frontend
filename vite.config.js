import { defineConfig } from "vite";

const proxyTarget = process.env.VITE_PROXY_TARGET || "https://phishingscale-5eow.onrender.com";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true
      }
    }
  },
  preview: {
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true
      }
    }
  }
});
