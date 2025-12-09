const _adminLayout = () => import("@/components/AdminLayout.vue");

const AdminLogin = () => import("@/views/LoginView.vue");
const Dashboard = () => import("@/views/DashboardView.vue");
const Homesetting = () => import("@/views/HomeSettingView.vue");
const IntroSetting = () => import("@/views/IntroSettingView.vue");
const NoticeSetting = () => import("@/views/NoticeSettingView.vue");
const LocationSetting = () => import("@/views/LocationSettingView.vue");
const FrontendControl = () => import("@/views/FrontendControlView.vue");
const OrderQuery = () => import("@/views/OrderQueryView.vue");
const MemberQuery = () => import("@/views/MemberQueryView.vue");
const Reviews = () => import("@/views/ReviewsView.vue");
const Reports = () => import("@/views/ReportsView.vue");
const SocialSetting = () => import("@/views/SocialSettingView.vue");
const ParamsSetting = () => import("@/views/ParamsSettingView.vue");

  // === 後台路由設定 ===
const routes = [
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin,
    meta: { requiresAuth: false } // 明確標記不用權限
  },
  {
    path: '/admin',
    component: _adminLayout,
    meta: { requiresAuth: true }, // 標記需要登入
    children: [
      { 
        path: '', 
        redirect: '/admin/dashboard' 
      },
      { 
        path: 'dashboard', 
        name: 'admin-dashboard', 
        component: Dashboard, 
        meta: { title: '總覽' } 
      },
      {
        path: 'home-setting',
        name: 'home-setting',
        component: Homesetting, // 懶加載範例
        meta: { title: '首頁設定' }
      },
      {
        path: 'intro-setting',
        name: 'intro-setting',
        component: IntroSetting, // 懶加載範例
        meta: { title: '介紹設定' }
      },
      {
        path: 'notice-setting',
        name: 'notice-setting',
        component: NoticeSetting, // 懶加載範例
        meta: { title: '訂房須知' }
      },
      {
        path: 'location-setting',
        name: 'location-setting',
        component: LocationSetting, // 懶加載範例
        meta: { title: '首頁設定' }
      },
      {
        path: 'frontend-control',
        name: 'frontend-control',
        component: FrontendControl, // 懶加載範例
        meta: { title: '前端頁面控制' }
      },
      {
        path: 'order-query',
        name: 'order-query',
        component: OrderQuery, // 懶加載範例
        meta: { title: '異動訂單查詢' }
      },
      {
        path: 'member-query',
        name: 'member-query',
        component: MemberQuery, // 懶加載範例
        meta: { title: '會員/訂房查詢' }
      },
      {
        path: 'reviews',
        name: 'reviews',
        component: Reviews, // 懶加載範例
        meta: { title: '預覽評價' }
      },
      {
        path: 'reports',
        name: 'reports',
        component: Reports, // 懶加載範例
        meta: { title: '報表產生' }
      },
      {
        path: 'social-setting',
        name: 'social-setting',
        component: SocialSetting, // 懶加載範例
        meta: { title: '社群設定' }
      },
      {
        path: 'params-setting',
        name: 'params-setting',
        component: ParamsSetting, // 懶加載範例
        meta: { title: '參數設定' }
      },
    ]
  },
  // 404
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export default { routes };
