import { createRouter, createWebHistory } from "vue-router";
import routerMap from "./router.js";
import { useAdminStore } from '@/stores/AdminAuth';
// import webConfig from "../config.js";
const base = process.env.NODE_ENV === "development" ? "/" : "/TEST/";

// vue 增加 vite-porxy 解決前後端開發 session 問題
// const base = "/TEST/"; //前後端path要一致，session才能共用

const router = createRouter({
  history: createWebHistory(base),
  routes: routerMap.routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore();
  const isLoggedIn = adminStore.isLoggedIn; // 確保這裡能正確拿到 true/false

  // 1. 【白名單優先】如果是要去「登入頁」
  if (to.name === 'admin-login') {
    if (isLoggedIn) {
      // 如果已登入卻想去登入頁 -> 踢回 Dashboard
      next({ name: 'admin-dashboard' });
    } else {
      // 沒登入去登入頁 -> 放行 (return 結束函式，確保不會跑到下面)
      next(); 
    }
    return;
  }

  // 2. 檢查是否需要權限
  // to.matched.some 會檢查該路由及其所有父路由
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    if (!isLoggedIn) {
      // 需要權限但沒登入 -> 踢去登入頁
      next({ name: 'admin-login' });
    } else {
      // 需要權限且已登入 -> 放行
      next();
    }
  } else {
    // 3. 其他不需要權限的頁面 (如前台) -> 放行
    next();
  }
});

export default router;
