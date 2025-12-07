import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import path from "path";

// https://vite.dev/config/
export default ({ mode }) => {
  const _env = loadEnv(mode, process.cwd());
  const basePath =
    _env.VITE_NODE_ENV === "development" ? "/" : "/TEST/static/main/";
  return defineConfig({
  plugins: [
    vue(),
    quasar(),
  ],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import "src/assets/styles/quasar-variables.scss;"`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 8099,
  },
})
};