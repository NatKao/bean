<template>
  <div>
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-20">
          <router-link to="/" class="flex items-center cursor-pointer">
            <span class="text-2xl font-bold text-primary tracking-wider"
              >水尾民宿</span
            >
          </router-link>

          <div class="hidden md:flex space-x-4 items-center relative">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :active-class="item.path === '/' ? '' : 'text-primary bg-primary/10'"
              :exact-active-class="item.path === '/' ? 'text-primary bg-primary/10' : ''"
              :class="'text-gray-500 hover:text-primary'"
              >{{ item.label }}</router-link
            >

            <!--<div class="relative ml-4">
              <button @click="handleUserBtnClick" class="px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors flex items-center gap-2">
                <font-awesome-icon :icon="['fas', 'user']" />
                {{ userDisplayLabel }}
              </button>
              
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in origin-top-right"
              >
                <button
                  @click="router.push('/profile'); userMenuOpen = false"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  ><font-awesome-icon
                    :icon="['far', 'id-card']"
                    class="w-4"
                  />個人資料</button
                >
                <button
                  @click="router.push('/history'); userMenuOpen = false"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  ><font-awesome-icon
                    :icon="['fas', 'clock-rotate-left']"
                    class="w-4"
                  />消費紀錄</button
                >
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  ><font-awesome-icon
                    :icon="['fas', 'arrow-right-from-bracket']"
                    class="w-4"
                  />登出</button
                >
              </div>

              <div
                v-if="userMenuOpen"
                @click="userMenuOpen = false"
                class="fixed inset-0 z-40 cursor-default"
              ></div>
            </div>-->
          </div>

          <div class="md:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen">
              <font-awesome-icon
                :icon="['fas-solid', mobileMenuOpen ? 'fa-xmark' : 'fa-bars']"
                :class="['text-xl text-gray-500']"
              />
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-50"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="block w-full text-left px-3 py-4 text-base font-medium transition-colors"
            :active-class="item.path === '/' ? '' : 'text-primary bg-primary/10'"
            :exact-active-class="item.path === '/' ? 'text-primary bg-primary/10' : ''"
            :class="'text-gray-700 hover:bg-gray-50'"
            >{{ item.label }}</router-link
          >

          <div v-if="currentUser" class="border-t border-gray-100 mt-2 pt-2">
            <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">會員專區</div>
            <button
              @click="router.push('/profile'); mobileMenuOpen = false"
              class="block w-full text-left px-3 py-3 text-primary font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <font-awesome-icon :icon="['far', 'id-card']" />個人資料
            </button>
            <button
              @click="router.push('/history'); mobileMenuOpen = false"
              class="block w-full text-left px-3 py-3 text-primary font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'clock-rotate-left']" />消費紀錄
            </button>
            <button
              @click="handleLogout"
              class="block w-full text-left px-3 py-3 text-red-500 font-medium hover:bg-red-50 flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />登出
            </button>
          </div>
          <button
            v-else
            @click="handleUserBtnClick"
            class="block w-full text-left px-3 py-4 text-primary font-bold border-t border-gray-100"
          >登入</button>
        </div>
      </div>
    </nav>

    <main class="flex-grow pt-20 pb-24 flex flex-col">
      <router-view></router-view>
    </main>

    <footer
      class="fixed bottom-0 left-0 right-0 z-40 bg-dark text-white py-4 text-center text-sm shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
    >
      545南投縣埔里鎮向善路102號 | Phone: 0980-072-867
    </footer>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/OcAuth.js";
import { storeToRefs } from "pinia";  // 引入 storeToRefs解構

const $msg = inject('$msg')
const router = useRouter();
const userStore = useUserStore();

// Navigation config
const navItems = [
  { path: "/", label: "首頁" },
  { path: "/intro", label: "民宿介紹" },
  { path: "/rules", label: "訂房須知" },
  { path: "/location", label: "地理位置" },
  { path: "/emptyroom", label: "空房查詢" },
  
];

const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);

// 3. 使用 storeToRefs 取出 State 和 Getters
// 這樣寫，當 store 變更時，這裡的變數也會自動變更
const { currentUser, userDisplayLabel } = storeToRefs(userStore);

// 4. 登入按鈕邏輯簡化
const handleUserBtnClick = () => {
  // 直接判斷 store 裡的 state
  if (!currentUser.value) {
    router.push("/login");
    mobileMenuOpen.value = false;
  } else {
    userMenuOpen.value = !userMenuOpen.value;
  }
};

const handleLogout = async () => {
  const isOk = await $msg.confirm("確定要登出嗎？");
  if (isOk) {
    userStore.logout(); // 呼叫 store 的 action
    userMenuOpen.value = false;
    mobileMenuOpen.value = false;
    router.push("/");
  }
};
</script>