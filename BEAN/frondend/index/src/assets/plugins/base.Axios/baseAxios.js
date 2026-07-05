import axios from "axios";
import { $msg } from "@/assets/utils/msgState"; // 引入我們的全域 UI 工具

let needLoadingRequestCount = 0;
let customLoadMaskState = true; // 預設開啟遮罩

export default {
  install(app, options = {}) {
    // 設定選項預設值
    const showLoaderMask = options.showLoaderMask ?? true;
    const showRtnMessage = options.showNotifyMsg !== false;

    // 自訂 Headers
    const customHeaders = options.axiosHeaders || {
      get: {
        Accept: "application/json",
        Pragma: "no-cache",
        "Cache-Control": "no-cache, no-store"
      },
      post: { "Content-Type": "application/json" },
      put: { "Content-Type": "application/json" },
      delete: { "Content-Type": "application/json", Accept: "application/json" }
    };

    // 設定 Axios 預設值
    axios.defaults.baseURL = import.meta.env.VITE_API_HOST || "";
    axios.defaults.timeout = 30000;

    // 建立 Axios 實例工廠
    const createBaseDefault = config => {
      if (config) return axios.create(config);
      return axios.create({
        baseURL: import.meta.env.VITE_API_HOST || "",
        withCredentials: true,
        headers: customHeaders
      });
    };

    const baseAxios = createBaseDefault();

    // ==========================================
    // Loading 控制 (使用 $msg)
    // ==========================================
    function showFullScreenLoading() {
      if (!showLoaderMask) return;

      // 如果這次請求指定不開遮罩 (customLoadMaskState = false)
      if (!customLoadMaskState) {
        customLoadMaskState = true; // 用完還原預設值
        return;
      }

      if (needLoadingRequestCount === 0) {
        $msg.showLoading(); // 呼叫 GlobalUI
      }
      needLoadingRequestCount++;
    }

    function tryHideFullScreenLoading() {
      if (!showLoaderMask) return;
      if (needLoadingRequestCount <= 0) return;

      needLoadingRequestCount--;
      if (needLoadingRequestCount === 0) {
        // 使用 debounce 避免閃爍
        setTimeout(() => {
          $msg.hideLoading(); // 呼叫 GlobalUI
        }, 300);
      }
    }

    // ==========================================
    // 攔截器 (Interceptors)
    // ==========================================

    // Request 攔截
    baseAxios.interceptors.request.use(
      config => {
        // 開發環境 Log
        if (import.meta.env.DEV) {
          console.log(
            `[BaseAxios] ${config.method.toUpperCase()} ${config.url}`
          );
          // 靜態模式模擬 (如果是 json-server 或 static)
          if (import.meta.env.VITE_API_MODE === "static") {
            config.url = "static/data/" + config.url.split("?")[0] + ".json";
          }
        }

        showFullScreenLoading();
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response 攔截
    baseAxios.interceptors.response.use(
      response => {
        tryHideFullScreenLoading();

        // JSON Server 模式處理
        if (import.meta.env.VITE_API_MODE === "json-server") {
          if (response.status >= 200 && response.status <= 299) {
            return { returnCode: 0, msg: "", data: response.data };
          }
          $msg.notify.error("伺服器錯誤", response.data.msg || "維護中");
          return response.data;
        }

        // 正常 API 邏輯
        const res = response.data;

        if (res && res.returnCode === 0) {
          if (res.msg && res.msg.length > 0 && showRtnMessage) {
            $msg.notify.success(res.msg);
          }
          return res;
        }

        // 特殊錯誤碼處理
        if (res && res.returnCode === 403) {
          $msg.alert.error("權限不足", "請重新登入系統").then(() => {
            // location.reload(); // 可依需求開啟
          });
        }

        // 一般錯誤通知
        if (showRtnMessage) {
          $msg.notify.error("錯誤", res.msg || "伺服器維護中");
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
          $msg.notify.error("連線錯誤", msg);
        }
        return Promise.resolve({ returnCode: -1, msg: error.message });
      }
    );

    // ==========================================
    // 檔案下載相關工具
    // ==========================================
    function download(data, fileName) {
      if (!data) return;
      const blob = new Blob([data], { type: "application/octet-stream" });

      if (window.navigator.msSaveOrOpenBlob) {
        // IE
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    }

    const reader = new FileReader();
    function transBlobToObject(blob, callBack) {
      reader.onload = function () {
        callBack(JSON.parse(this.result));
      };
      reader.readAsText(blob);
    }

    // ==========================================
    // 公開方法物件 (publicAxiosMethod)
    // ==========================================
    const publicAxiosMethod = {
      get: (url, param, customOptions) => {
        if (customOptions?.hasLoadMask !== undefined)
          customLoadMaskState = customOptions.hasLoadMask;
        return baseAxios.get(url, { params: param });
      },
      post: (url, body, customOptions) => {
        if (customOptions?.hasLoadMask !== undefined)
          customLoadMaskState = customOptions.hasLoadMask;
        return baseAxios.post(url, body);
      },
      put: (url, body, customOptions) => {
        if (customOptions?.hasLoadMask !== undefined)
          customLoadMaskState = customOptions.hasLoadMask;
        return baseAxios.put(url, body);
      },
      delete: (url, body, customOptions) => {
        if (customOptions?.hasLoadMask !== undefined)
          customLoadMaskState = customOptions.hasLoadMask;
        return baseAxios.delete(url, { data: body });
      },

      // 上傳功能 (整合 $msg)
      upload: (url, body, customOptions) => {
        if (customOptions?.hasLoadMask !== undefined)
          customLoadMaskState = customOptions.hasLoadMask;
        showFullScreenLoading();

        return axios
          .post(url, body, {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-Requested-With": "XMLHttpRequest"
            },
            withCredentials: true
          })
          .then(response => {
            tryHideFullScreenLoading();
            const res = response.data;
            if (res && res.returnCode == 0) {
              if (res.msg && showRtnMessage) $msg.notify.success(res.msg);
              return Promise.resolve(res);
            }
            if (showRtnMessage) $msg.notify.error(res.msg || "上傳失敗");
            return Promise.resolve(res);
          })
          .catch(error => {
            tryHideFullScreenLoading();
            if (showRtnMessage)
              $msg.notify.error("上傳發生錯誤", error.message);
            return Promise.resolve(error);
          });
      },

      // 下載功能 (整合 $msg)
      download: (url, body, name, customOptions) => {
        if (customOptions?.hasLoadMask !== undefined)
          customLoadMaskState = customOptions.hasLoadMask;

        let _url = url;
        // 如果 url 不是絕對路徑，拼接 API_HOST
        if (import.meta.env.VITE_API_HOST && !url.startsWith("http")) {
          // 簡單判斷
          _url =
            import.meta.env.VITE_API_HOST +
            (url.startsWith("/") ? "" : "/") +
            url;
        }

        showFullScreenLoading();
        return new Promise((resolve, reject) => {
          axios
            .post(_url, body, {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest"
              },
              transformRequest: [
                data => {
                  let ret = "";
                  for (let key in data) {
                    ret +=
                      encodeURIComponent(key) +
                      "=" +
                      encodeURIComponent(data[key]) +
                      "&";
                  }
                  return ret;
                }
              ],
              withCredentials: true,
              responseType: "blob"
            })
            .then(resp => {
              tryHideFullScreenLoading();
              // 檢查是不是 JSON 錯誤訊息 (Content-Type 不是 blob)
              if (!resp.data || resp.data.type != "application/octet-stream") {
                transBlobToObject(resp.data, data => {
                  $msg.notify.error("下載失敗", data.msg);
                  resolve(data);
                });
              } else {
                resolve(download(resp.data, name));
              }
            })
            .catch(err => {
              tryHideFullScreenLoading();
              reject(err);
            });
        });
      },

      create: config => createBaseDefault(config)
    };

    // 掛載到全域
    app.config.globalProperties.$baseAxios = publicAxiosMethod;
    app.provide("$baseAxios", publicAxiosMethod);
  }
};
