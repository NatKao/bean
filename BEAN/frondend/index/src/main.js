import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { FontAwesomeIcon } from "@/assets/libs/IconsLib.js";
// import { FontAwesomeLayers } from "@fortawesome/vue-fontawesome";

import BaseAxios from "@/assets/plugins/base.Axios/baseAxios.js";

import '@/assets/css/index.css';      // 引入 Tailwind CSS 在 Quasar 之後

// 第三方套件
import { setupCalendar, DatePicker } from "v-calendar";

import "v-calendar/style.css";


import webConfig from "./config.js";

const app = createApp(App)

app.component("FontAwesomeIcon", FontAwesomeIcon);
// app.component("FontAwesomeLayers", FontAwesomeLayers);

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

const mockUI = {
    install(app) {
        app.config.globalProperties.$notify = {
            success: (msg) => alert(`✅ ${msg}`),
            error: (msg) => alert(`❌ ${msg}`)
        };
        app.config.globalProperties.$loader = {
            open: () => console.log('Loading start...'),
            close: () => console.log('Loading end...')
        };
    }
};
app.use(mockUI);
app.use(BaseAxios, { conf: app.config.globalProperties.$conf });

app.mount("#app");
