import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,

    // vite dev 서버 캐시 끄기
    headers: {
      "Cache-Control": "no-store",
    },

    // proxy 추가
    proxy: {
      "/auth": {
        target: "https://salpyeo.store",
        changeOrigin: true,
        secure: false,
      },
      "/mypage": {
        target: "https://salpyeo.store",
        changeOrigin: true,
        secure: false,
      },
      "/report": {
        target: "https://salpyeo.store",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
