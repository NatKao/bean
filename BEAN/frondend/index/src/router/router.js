const Layout = () => import("@/components/layouts/_Layout.vue"); // 引入 Layout

const HomeView = () => import("@/views/HomeView.vue");
const IntroView = () => import("@/views/IntroView.vue");
const RulesView = () => import("@/views/RulesView.vue");
const LocationView = () => import("@/views/LocationView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const HistoryView = () => import("@/views/HistoryView.vue");
const EmptyroomView = () => import("@/views/EmptyroomView.vue");

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", name: "home", component: HomeView },
      { path: "/intro", name: "intro", component: IntroView },
      { path: "/rules", name: "rules", component: RulesView },
      { path: "/location", name: "location", component: LocationView },
      { path: "/emptyroom", name: "emptyroom", component: EmptyroomView },
      { path: "/beanWorld", name: "beanWorld", component: LoginView },
      { path: "/profile", name: "profile", component: ProfileView },
      { path: "/history", name: "history", component: HistoryView }
    ]
  },

  // 沒有符合的都來這
  {
    path: "/:catchAll(.*)",
    redirect: "/index"
  }
];

export default { routes };
