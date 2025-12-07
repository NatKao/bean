import { Quasar, Loading, Notify, Dialog } from "quasar";
import quasarLang from "quasar/lang/zh-TW.js";
// Import Quasar css
import 'quasar/dist/quasar.css';
// import "quasar/src/css/index.sass";
// Import icon libraries, 如果需要其他的, 自己去 `@quasar/extras/` 裡面找
import "@quasar/extras/material-icons/material-icons.css";

export default {
  install(app, options = {}) {
    app.use(Quasar, {
      plugins: { Loading, Notify, Dialog }, // import Quasar plugins and add here
      lang: quasarLang,
    });
  },
};