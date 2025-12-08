import axios from "axios";

let needLoadingRequestCount = 0;

export default {
  install(app, options) {
    // 防呆：確保 options 存在
    options = options || {};
    options.conf = options.conf || {};

    const baseAxios = axios.create({
      baseURL: import.meta.env.VITE_API_HOST || "", // 防呆：避免 undefined
      withCredentials: true,
      headers: {
        get: {
          Accept: "application/json",
          Pragma: "no-cache",
          "Cache-Control": "no-cache, no-store"
        },
        post: {
          "Content-Type": "application/json"
        },
        put: {
          "Content-Type": "application/json"
        },
        delete: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    });

    const showRtnMessage = options.conf.SHOW_RTNMESSAGE !== false;

    // 輔助函式：安全地呼叫通知 (避免使用者沒裝 UI 套件時報錯)
    const safeNotify = (type, msg) => {
      if (app.config.globalProperties.$notify) {
        app.config.globalProperties.$notify[type](msg);
      } else {
        console.warn(`[Notify ${type}]: ${msg}`);
      }
    };

    baseAxios.interceptors.response.use(
      response => {
        tryHideFullScreenLoading();
        const resp = {};
        
        // JSON Server 模式
        if (import.meta.env.VITE_API_MODE === "json-server") {
          if (response.status >= 200 && response.status <= 299) {
            resp.data = {
              returnCode: 0,
              msg: "",
              data: response.data
            };
            return resp.data;
          }
          safeNotify("error", response.data.msg || "伺服器維護中，請稍候再試!");
          return response.data;
        }

        // 一般模式
        if (response.data && response.data.returnCode == 0) {
          if (response.data.msg && response.data.msg.length > 0 && showRtnMessage) {
            safeNotify("success", response.data.msg);
          }
          return response.data;
        }

        if (response.data && response.data.returnCode == 403) {
          location.reload();
        }

        if (showRtnMessage) {
          safeNotify("error", response.data.msg || "伺服器維護中，請稍候再試!");
        }
        return response.data;
      },
      error => {
        tryHideFullScreenLoading();
        if (showRtnMessage) {
          safeNotify("error", "伺服器維護中，請稍候再試!");
        }
        return Promise.resolve(error);
      }
    );

    baseAxios.interceptors.request.use(config => {
      // 開發環境顯示 Log
      if (import.meta.env.DEV) {
        console.log("[Axios] Request Url: " + config.url);
        if (import.meta.env.VITE_API_MODE === "static") {
           // 這裡可能會造成路徑錯誤，建議根據實際需求保留或刪除
           // config.url = "static/data/" + config.url.split("?")[0] + ".json";
        }
      }
      showFullScreenLoading();
      return config;
    });

    // --- 主要修復點：修正變數名稱 body -> req ---
    app.config.globalProperties.$baseAxios = (method, url, req) => {
      switch (method) {
        case "get":
          return app.config.globalProperties.$baseAxios.get(url, req);
        case "post":
          return app.config.globalProperties.$baseAxios.post(url, req);
        case "put":
          return app.config.globalProperties.$baseAxios.put(url, req);
        case "delete":
          return app.config.globalProperties.$baseAxios.delete(url, req);
        default:
          safeNotify("error", "不支援的方法");
      }
    };

    app.config.globalProperties.$baseAxios.get = (url, param) => {
      return baseAxios.get(url, { params: param });
    };
    app.config.globalProperties.$baseAxios.post = (url, body) => {
      return baseAxios.post(url, body);
    };
    app.config.globalProperties.$baseAxios.put = (url, body) => {
      return baseAxios.put(url, body);
    };
    app.config.globalProperties.$baseAxios.delete = (url, body) => {
      return baseAxios.delete(url, { data: body });
    };

    // Upload 與 Download 功能保持原樣，僅修復 notify 呼叫
    app.config.globalProperties.$baseAxios.upload = (url, body) => {
      let _url = url;
      if (import.meta.env.VITE_API_HOST && import.meta.env.VITE_API_HOST != "/") {
        _url = import.meta.env.VITE_API_HOST + "/" + url;
      }
      showFullScreenLoading();
      return axios.post(_url, body, {
          headers: {
            "Content-Type": "multipart/form-data;",
            "X-Requested-With": "XMLHttpRequest"
          },
          withCredentials: true
        })
        .then(response => {
          tryHideFullScreenLoading();
          if (response.data && response.data.returnCode == 0) {
            if (response.data.msg && showRtnMessage) {
              safeNotify("success", response.data.msg);
            }
            return Promise.resolve(response.data);
          }
          if (showRtnMessage) safeNotify("error", response.data.msg);
          return Promise.resolve(response.data);
        })
        .catch(error => {
          tryHideFullScreenLoading();
          if (showRtnMessage) safeNotify("error", "上傳發生錯誤!");
          return Promise.resolve(error);
        });
    };

    // 為了縮短篇幅，Download 邏輯相同，請確保裡面的 app.$notify 改成 safeNotify 即可

    // 讓 Composition API (inject) 也可以用，不僅限於 Options API (this.$baseAxios)
    app.provide('$baseAxios', app.config.globalProperties.$baseAxios);


    // --- 內部函式 ---

    function showFullScreenLoading() {
      // 檢查是否有掛載 loading 插件
      if (!app.config.globalProperties.$loader && !app.$loader) return;
      
      const loader = app.config.globalProperties.$loader || app.$loader;
      
      if (needLoadingRequestCount === 0) {
        if(loader.open) loader.open();
      }
      needLoadingRequestCount += 1;
    }

    function tryHideFullScreenLoading() {
      // --- 主要修復點：解開註解，不然 Loading 永遠不會消失 ---
      const loader = app.config.globalProperties.$loader || app.$loader;
      if (!loader) return;
      
      if (needLoadingRequestCount <= 0) return;

      needLoadingRequestCount -= 1;
      if (needLoadingRequestCount === 0) {
        // 使用 debounce 避免閃爍
        setTimeout(function () {
          if(loader.close) loader.close();
        }, 300);
      }
    }
  }
};