import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export const useAdminStore = defineStore(
  "adminAuth",
  () => {
    const router = useRouter();

    // State
    const token = ref("");
    const adminInfo = ref(null);

    // Getters
    const isLoggedIn = computed(() => !!token.value);
    const currentRole = computed(() => adminInfo.value?.role || "viewer"); // 預設權限

    // Actions
    const login = async (username, password) => {
      // 這裡模擬 API 請求
      return new Promise((resolve, reject) => {
        if (username && password) {
          // 模擬成功
          token.value = "mock-admin-token-" + Date.now();
          adminInfo.value = {
            username,
            name: username === "admin" ? "Super Admin" : "Admin User",
            role: "admin", // 預設給最大權限，可之後調整
            avatar: "https://cdn.quasar.dev/img/boy-avatar.png"
          };
          resolve({ success: true });
        } else {
          reject({ success: false, message: "請輸入帳號密碼" });
        }
      });
    };

    const logout = () => {
      token.value = "";
      adminInfo.value = null;
      // 登出後導向登入頁
      // 注意：在 store 裡直接用 router.push 有時會有限制，建議在組件層呼叫，或確保 router 已掛載
    };

    // 模擬切換權限 (這是你原本檔案有的功能)
    const switchRole = role => {
      if (adminInfo.value) {
        adminInfo.value.role = role;
      }
    };

    return {
      token,
      adminInfo,
      isLoggedIn,
      currentRole,
      login,
      logout,
      switchRole
    };
  },
  {
    persist: true // 記得開啟持久化，這樣F5重整才不會被踢出
  }
);
