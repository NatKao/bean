import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { FontAwesomeIcon } from "@/assets/libs/IconsLib.js";
// import { FontAwesomeLayers } from "@fortawesome/vue-fontawesome";

import { $user } from '@/assets/utils/userState';
import { $room } from '@/assets/utils/roomState';
import { $msg } from '@/assets/utils/msgState'; // 引入狀態控制器
import baseAxios from "@/assets/plugins/base.Axios/baseAxios.js";

import '@/assets/css/index.css';      // 引入 Tailwind CSS 在 Quasar 之後

// 第三方套件
import { setupCalendar, DatePicker } from "v-calendar";

import "v-calendar/style.css";


import webConfig from "./config.js";

const app = createApp(App)

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.provide('$user', $user);
app.provide('$room', $room);
app.provide('$msg', $msg);

webConfig.INIT();
app.config.globalProperties.$conf = webConfig;
app.config.globalProperties.$publicPath = import.meta.env.BASE_URL;
app.$conf = app.config.globalProperties.$conf;

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);

app.use(setupCalendar, {});
app.component("DatePicker", DatePicker);

app.use(baseAxios, {
    showLoaderMask: true, // 預設開啟 Loading
    showNotifyMsg: true   // 預設開啟後端回傳訊息通知
});


app.mount("#app");
