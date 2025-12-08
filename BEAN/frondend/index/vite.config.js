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
      proxy: {
        // 當路徑包含 /api 時，轉發給後端
        '/api': {
          target: 'http://localhost:8080', // 後端地址
          changeOrigin: true,
          // 如果後端沒有 /api 前綴但你想在前端用，可以用 rewrite 去掉，
          // 但我們上面 Controller 已經設了 /api，所以這裡不需要 rewrite
          // rewrite: (path) => path.replace(/^\/api/, '') 
        }
      }
    },
  })
};
