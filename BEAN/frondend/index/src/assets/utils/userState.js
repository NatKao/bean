import { reactive, watch } from "vue";

// 1. 定義預設狀態
const STATE_KEY = "my_app_user_info"; // localStorage 的鑰匙名稱

// 嘗試從 localStorage 讀取舊資料，沒有的話就用預設值
const getSavedState = () => {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const savedState = getSavedState();

// 2. 建立響應式物件 (這就是你的 Store)
export const userState = reactive({
  isLoggedIn: !!savedState?.token ?? false, // 如果有 token 就代表已登入
  token: savedState?.token ?? "",
  name: savedState?.name ?? "",
  username: savedState?.username ?? "",
  role: savedState?.role ?? "guest"
});

// 3. 定義修改資料的方法 (Actions)
export const $user = {
  // 取得狀態 (唯讀用)
  state: userState,

  // 登入：更新狀態並寫入 localStorage
  login(data) {
    userState.isLoggedIn = true;
    userState.token = data.token;
    userState.name = data.name;
    userState.username = data.username;

    // 儲存到硬碟 (Local Storage)
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        isLoggedIn: userState.isLoggedIn,
        token: userState.token,
        name: userState.name,
        username: userState.username
      })
    );
  },

  // 登出：清空狀態並移除 localStorage
  logout() {
    userState.isLoggedIn = false;
    userState.token = "";
    userState.name = "";
    userState.username = "";

    localStorage.removeItem(STATE_KEY);
  },

  // 檢查是否有權限 (Router 守衛可以用)
  checkAuth() {
    return userState.isLoggedIn;
  }
};
