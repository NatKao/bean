import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default ({ mode }) => {
  const _env = loadEnv(mode, process.cwd());
  const basePath =
    _env.VITE_NODE_ENV === "development" ? "/" : "/TEST/static/main/";
  return defineConfig({
  plugins: [vue(),
    tailwindcss()
  ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    server: {
      port: 8100,
    },
  })
};
