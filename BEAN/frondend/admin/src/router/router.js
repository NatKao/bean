const _layout = () => import("@/components/_admin_layout.vue");

const Admin = () => import("@/views/Admin.vue");

const routes = [
  // 打斜線會出現什麼
  {
    path: "/",
    redirect: "/admin"
  },
  {
    path: "/",
    name: "root",
    //component: _layout,
    children: [
      {
        path: "/admin",
        name: "admin",
        component: Admin
      },
    ]
  },
  // 沒有符合的都來這
  {
    path: "/:catchAll(.*)",
    redirect: "/index"
  }
];

export default { routes };
