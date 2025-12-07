import { createRouter, createWebHistory } from "vue-router";
import routerMap from "./router.js";
// import { auth } from "@/stores/Auth";
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
  next();
});

export default router;
