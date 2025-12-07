const _layout = () => import("@/components/_layout.vue");
const _layout_tmp = () => import("@/components/_layout_tmp.vue");
const Index = () => import("@/views/Index.vue");

const routes = [
  // 打斜線會出現什麼
  {
    path: "/",
    redirect: "/index"
  },
  // 設定home才可以跟root分開
  {
    path: "/",
    name: "home",
    //component: _layout_tmp,
    children: [
      {
        path: "index",
        name: "index",
        component: Index
      }
    ]
  },
  // 沒有符合的都來這
  {
    path: "/:catchAll(.*)",
    redirect: "/index"
  }
];

export default { routes };
