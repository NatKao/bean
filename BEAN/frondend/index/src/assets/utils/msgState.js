import { reactive } from "vue";

export const msgState = reactive({
  isLoading: false,

  // 改成陣列，支援多則通知
  toasts: [],

  confirm: {
    show: false,
    title: "",
    message: "",
    resolve: null
  },

  // [新增] 訊息彈窗 (單純顯示訊息，只有一個按鈕)
  alert: {
    show: false,
    title: "",
    message: "",
    variant: "success", // success | error | warning | info
    resolve: null
  }
});

// 用來產生唯一 ID
let toastId = 0;

// ==========================================
// 1. Notify 核心邏輯 (Private)
// ==========================================
const _triggerNotify = (title, message, type = 'success', timeout = 3000) => {
  // 參數彈性處理 (簡寫模式)
  // 如果沒有 message，代表使用者只傳了一個字串，那就把它當作 message，標題留空
  if (!message) {
    message = title
    title = ''
  }

  const id = toastId++
  
  // 推入狀態
  msgState.toasts.push({
    id,
    title,
    message,
    type,
    timeout
  })

  // 設定自動移除
  setTimeout(() => {
    // 這裡不能用 this.removeToast，因為 _triggerNotify 是獨立函式
    // 我們直接操作 state 或是呼叫 $ui.removeToast (但在這裡 $ui 還沒定義完)
    // 最安全的方式是直接在這裡操作移除邏輯
    const index = msgState.toasts.findIndex(t => t.id === id)
    if (index !== -1) msgState.toasts.splice(index, 1)
  }, timeout)
}

// ==========================================
// 2. 建構 Notify 函式物件 (Magic)
// ==========================================
const notifyFunction = (title, message, type, timeout) => {
  return _triggerNotify(title, message, type, timeout)
}

// 掛載語法糖
// 注意：這裡的參數順序變成 (標題, 內容, 秒數)，不需要傳 type 了
notifyFunction.success = (title, message, timeout) => _triggerNotify(title, message, 'success', timeout)
notifyFunction.error   = (title, message, timeout) => _triggerNotify(title, message, 'error', timeout)
notifyFunction.warning = (title, message, timeout) => _triggerNotify(title, message, 'warning', timeout)
notifyFunction.info    = (title, message, timeout) => _triggerNotify(title, message, 'info', timeout)

// ==========================================
// 1. 核心 Alert 邏輯 (Private)
// ==========================================
// 這是最底層的實作，負責修改 state
const _triggerAlert = (title, message, variant = "success") => {
  return new Promise(resolve => {
    msgState.alert.title = title;
    msgState.alert.message = message;
    msgState.alert.variant = variant;
    msgState.alert.show = true;
    msgState.alert.resolve = resolve;
  });
};

// ==========================================
// 2. 建構 Alert 函式物件 (Magic happens here)
// ==========================================
// 讓 $ui.alert 本身是一個函式，可以 $ui.alert(...) 呼叫
const alertFunction = (title, message, variant) => {
  return _triggerAlert(title, message, variant);
};

// 同時掛載子方法，讓 $ui.alert.error(...) 也能呼叫
alertFunction.success = (title, message) =>
  _triggerAlert(title, message, "success");
alertFunction.error = (title, message) =>
  _triggerAlert(title, message, "error");
alertFunction.warning = (title, message) =>
  _triggerAlert(title, message, "warning");
alertFunction.info = (title, message) => _triggerAlert(title, message, "info");

export const $msg = {
  // --- Loading ---
  showLoading() {
    msgState.isLoading = true;
  },
  hideLoading() {
    msgState.isLoading = false;
  },


  // --- Notify (核心修改) ---
  notify: notifyFunction,

  // 移除指定 ID 的通知
  removeToast(id) {
    const index = msgState.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      msgState.toasts.splice(index, 1);
    }
  },
  // --- Confirm ---
  confirm(title, message) {
    return new Promise(resolve => {
      msgState.confirm.title = title || "確認";
      msgState.confirm.message = message;
      msgState.confirm.show = true;
      msgState.confirm.resolve = resolve;
    });
  },
  _handleConfirm(result) {
    msgState.confirm.show = false;
    if (msgState.confirm.resolve) {
      msgState.confirm.resolve(result);
      msgState.confirm.resolve = null;
    }
  },
  // --- Alert (使用剛剛組合好的函式物件) ---
  alert: alertFunction,

  _closeAlert() {
    msgState.alert.show = false
    if (msgState.alert.resolve) {
      msgState.alert.resolve(true)
      msgState.alert.resolve = null
    }
  }
};
