import axios from "axios";

let needLoadingRequestCount = 0;

export default {
  install(app, options) {
    // 防呆處理
    options = options || {};
    options.conf = options.conf || {};

    // ==========================================
    // 1. 定義 UI 適配器 (核心修改邏輯)
    // ==========================================
    const ui = {
      // 顯示通知
      notify: (type, msg) => {
        // 優先檢查是否有 Quasar 的 $q
        const $q = app.config.globalProperties.$q;
        // 其次檢查是否有 Element Plus 的 $notify
        const $notify = app.config.globalProperties.$notify;

        if ($q && $q.notify) {
          // Quasar 寫法
          const color =
            type === "error"
              ? "negative"
              : type === "success"
              ? "positive"
              : "primary";
          $q.notify({
            message: msg,
            color: color,
            icon: type === "error" ? "warning" : "check"
          });
        } else if ($notify) {
          // Element Plus 寫法
          $notify[type](msg);
        } else {
          // --- [Fallback] 原生 JS 降級處理 ---
          const logPrefix = type === "error" ? "❌ [Error]" : "✅ [Success]";
          console.log(`${logPrefix}: ${msg}`);

          // 如果是嚴重錯誤，可以用 alert 彈窗 (可選)
          if (type === "error") {
            // alert(msg);
          }
        }
      },

      // 顯示 Loading
      showLoading: () => {
        const $q = app.config.globalProperties.$q;
        const $loader = app.config.globalProperties.$loader; // 自定義或其他庫

        if ($q && $q.loading) {
          $q.loading.show();
        } else if ($loader && $loader.open) {
          $loader.open();
        } else {
          // --- [Fallback] 原生 JS 降級處理 ---
          // 把滑鼠游標變成「等待中」的沙漏/圓圈
          document.body.style.cursor = "wait";
          console.log("[Axios] Loading start...");
        }
      },

      // 隱藏 Loading
      hideLoading: () => {
        const $q = app.config.globalProperties.$q;
        const $loader = app.config.globalProperties.$loader;

        if ($q && $q.loading) {
          $q.loading.hide();
        } else if ($loader && $loader.close) {
          $loader.close();
        } else {
          // --- [Fallback] 原生 JS 降級處理 ---
          // 恢復滑鼠游標
          document.body.style.cursor = "default";
          console.log("[Axios] Loading end.");
        }
      }
    };

    // ==========================================
    // 2. Axios 實例建立
    // ==========================================
    const baseAxios = axios.create({
      baseURL: import.meta.env.VITE_API_HOST || "",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    });

    const showRtnMessage = options.conf.SHOW_RTNMESSAGE !== false;

    // ==========================================
    // 3. 攔截器 (改用 ui 物件呼叫)
    // ==========================================
    baseAxios.interceptors.request.use(
      config => {
        // 在開發環境印出 Log
        if (import.meta.env.DEV) {
          console.log(`[Axios] ${config.method.toUpperCase()} ${config.url}`);
        }

        showFullScreenLoading();
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    baseAxios.interceptors.response.use(
      response => {
        tryHideFullScreenLoading();
        const res = response.data;

        // 模擬 JSON Server 結構
        if (import.meta.env.VITE_API_MODE === "json-server") {
          // ... 略 ...
          return res;
        }

        // 正常判斷
        if (res && res.returnCode === 0) {
          if (res.msg && showRtnMessage) {
            ui.notify("success", res.msg); // 使用 fallback 機制
          }
          return res;
        }

        // 權限不足
        if (res && res.returnCode === 403) {
          ui.notify("error", "權限不足，請重新登入");
          // location.reload();
        } else if (showRtnMessage) {
          ui.notify("error", res.msg || "發生錯誤");
        }

        return res;
      },
      error => {
        tryHideFullScreenLoading();
        let msg = "伺服器連線失敗";
        if (error.response) {
          if (error.response.status === 404) msg = "找不到資源 (404)";
          if (error.response.status === 500) msg = "伺服器內部錯誤 (500)";
          if (error.response.status === 403) msg = "拒絕存取 (403)";
        }

        if (showRtnMessage) {
          ui.notify("error", msg); // 使用 fallback 機制
        }
        return Promise.reject(error);
      }
    );

    // ==========================================
    // 4. 掛載到全域
    // ==========================================

    // 支援 Composition API inject('$baseAxios')
    app.provide("$baseAxios", app.config.globalProperties.$baseAxios);

    // 支援 Options API this.$baseAxios
    // 這裡我們直接把原生的 baseAxios 方法對應上去，簡化原本 switch case 的複雜度
    app.config.globalProperties.$baseAxios = baseAxios;

    // 如果你需要保留原本的 upload/download 擴充方法，可以加在這裡
    // app.config.globalProperties.$baseAxios.upload = ...

    // ==========================================
    // 內部 Loading 控制
    // ==========================================
    function showFullScreenLoading() {
      if (needLoadingRequestCount === 0) {
        ui.showLoading();
      }
      needLoadingRequestCount++;
    }

    function tryHideFullScreenLoading() {
      if (needLoadingRequestCount <= 0) return;
      needLoadingRequestCount--;
      if (needLoadingRequestCount === 0) {
        setTimeout(() => {
          ui.hideLoading();
        }, 300);
      }
    }
  }
};
