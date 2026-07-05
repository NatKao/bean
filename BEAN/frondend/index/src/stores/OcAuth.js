// src/stores/OcAuth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
    // 1. State: 使用者資訊
    const currentUser = ref(null)
    const token = ref('') // 如果以後有 JWT Token 可以存這裡

    // 2. Getters: 計算屬性
    // 判斷是否登入
    const isLoggedIn = computed(() => currentUser.value !== null)
    
    // 顯示名稱 (邏輯搬來這裡)
    const userDisplayLabel = computed(() => {
        if (!currentUser.value) return "登入"
        return currentUser.value.type === 'guest' 
            ? `訪客 ${currentUser.value.phone.slice(-4)}` 
            : currentUser.value.name
    })

    // 3. Actions: 動作
    // 一般會員登入
    const login = async (phone, password) => {
        try {
            // 這裡呼叫你的 Spring Boot 後端 API
            // 假設後端 API 是 POST /api/users/login
            /* const response = await axios.post('/api/users/login', { phone, password });
            currentUser.value = response.data; // 假設後端回傳完整的 User 物件
            */
            
            // --- 暫時模擬 (等你後端寫好 Login API 再換掉上面那段) ---
            // 假裝成功
            currentUser.value = {
                id: 1,
                name: "陳小明", // 這裡應該是後端查出來的名字
                phone: phone,
                type: "member",
                email: "demo@example.com"
            }
            // ----------------------------------------------------

            return { success: true, message: "登入成功" }
        } catch (error) {
            console.error(error)
            return { success: false, message: "帳號或密碼錯誤" }
        }
    }

    // 訪客登入 (查詢訂單用)
    const loginGuest = (phoneLast4) => {
        currentUser.value = {
            name: "貴賓",
            phone: `09xxxx${phoneLast4}`,
            type: "guest"
        }
    }

    // 登出
    const logout = () => {
        currentUser.value = null
        token.value = ''
        // 因為有插件，這裡不需要手動清除 localStorage，Pinia 會自動處理
    }

    // 更新個人資料
    const updateProfile = (newData) => {
        if (currentUser.value) {
            // Object.assign(target, source) -> 合併物件
            Object.assign(currentUser.value, newData)
        }
    }

    return { 
        currentUser, 
        token, 
        isLoggedIn, 
        userDisplayLabel, 
        login, 
        loginGuest, 
        logout,
        updateProfile 
    }
}, {
    // 4. 開啟持久化 (這是關鍵！重新整理不會登出)
    persist: true
})