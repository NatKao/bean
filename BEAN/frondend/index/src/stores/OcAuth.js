import { defineStore } from "pinia";

// --- 1. 定義 Pinia Store ---
export const useUserStore = defineStore("user", {
  state: () => ({
    // 嘗試從 localStorage 讀取使用者，實現持久化
    currentUser: JSON.parse(localStorage.getItem("user")) || null
  }),
  getters: {
    isLoggedIn: state => !!state.currentUser,
    userDisplayLabel: state => {
      if (!state.currentUser) return "登入";
      if (state.currentUser.type === "guest") {
        return `訪客 ${state.currentUser.phone.slice(-4)}`;
      }
      return state.currentUser.name;
    }
  },
  actions: {
    loginMember(name, phone) {
      const userData = { name, phone, type: "member" };
      this.currentUser = userData;
      this.saveToStorage();
    },
    loginGuest(phone) {
      const userData = { name: "訂房貴賓", phone, type: "guest" };
      this.currentUser = userData;
      this.saveToStorage(); // 訪客也暫存，方便流程
    },
    logout() {
      this.currentUser = null;
      localStorage.removeItem("user");
    },
    saveToStorage() {
      localStorage.setItem("user", JSON.stringify(this.currentUser));
    }
  }
});
