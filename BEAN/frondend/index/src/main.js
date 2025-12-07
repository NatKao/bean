import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@/assets/libs/IconsLib.js";
// import { FontAwesomeLayers } from "@fortawesome/vue-fontawesome";

import '@/assets/css/index.css';      // 引入 Tailwind CSS 在 Quasar 之後

// 第三方套件
import { setupCalendar, DatePicker } from "v-calendar";

import "v-calendar/style.css";

const app = createApp(App)

app.component("FontAwesomeIcon", FontAwesomeIcon);
// app.component("FontAwesomeLayers", FontAwesomeLayers);

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.use(setupCalendar, {});
app.component("DatePicker", DatePicker);

app.mount("#app");
