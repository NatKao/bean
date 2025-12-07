import { createApp } from 'vue'
// import '@/assets/css/style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from "pinia";
import FontAwesomeIcon from "@/assets/libs/IconsLib.js";
// import { Quasar } from 'quasar'
import quasar from "@/assets/libs/QuasarPlugin.js";

// 第三方套件
import { setupCalendar, DatePicker } from "v-calendar";

import "v-calendar/style.css";

const app = createApp(App)

app.component("FontAwesomeIcon", FontAwesomeIcon);

const pinia = createPinia();
app.use(pinia);

app.use(router);

// 使用 Quasar
// app.use(Quasar);
app.use(quasar);

app.use(setupCalendar, {});
app.component("DatePicker", DatePicker);

app.mount("#app");
