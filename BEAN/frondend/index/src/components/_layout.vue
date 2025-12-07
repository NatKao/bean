<template>
  <div>
    <main class="dark:bg-gray-800 bg-white relative overflow-x-hidden h-screen">
    <header class="h-24 sm:h-32 flex items-center z-30 w-full">
        <div class="container mx-auto px-6 flex items-center justify-between">
          <div class="" style="width: 200px;">
              <img
                alt
                src="@/assets/images/watertail.svg"
              />
            </div>
            <div class="flex items-center">
                <nav class="font-sen text-gray-800 dark:text-white uppercase text-xl xl:flex items-center hidden">
                    <router-link to="/index" class="py-2 px-6 flex">
                        首頁
                    </router-link>
                    <div class="relative" ref="dropdownRef">
                        <button class="peer relative z-10 block py-2 px-6 transition-colors duration-300 transform rounded-lg focus:outline-none" @click.prevent="openDropdownbtn">
                            介紹
                            <font-awesome-icon :icon="['fas', 'angle-down']" class="cl-fa-info" :class="switchDropbtn ? 'rotate-180' :''" style="margin-left: 4px;"/>
                        </button>
                        <div
                            class="hidden peer-focus:block absolute right-0 z-30 w-48 mt-2 overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800 border"
                        >
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                                <span class="text-gray-600 dark:text-gray-400">雙人床201</span>
                            </a>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                                <span class="text-gray-600 dark:text-gray-400">雙人床202</span>
                            </a>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                                <span class="text-gray-600 dark:text-gray-400">雙人床301</span>
                            </a>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                                <span class="text-gray-600 dark:text-gray-400">雙人床302</span>
                            </a>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                                <span class="text-gray-600 dark:text-gray-400">雙人床303</span>
                            </a>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                                <span class="text-gray-600 dark:text-gray-400">民宿環境</span>
                            </a>
                            <a href="#"
                                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                                <span class="text-gray-600 dark:text-gray-400">包棟須知</span>
                            </a>
                        </div>
                    </div>
                    <router-link to="/Information" class="py-2 px-6 flex">
                        訂房須知
                    </router-link>
                    <router-link to="/BookingLocation" class="py-2 px-6 flex">
                        地理位置
                    </router-link>
                    <router-link to="/Reserve" class="py-2 px-6 flex">
                        即刻預定
                    </router-link>
                </nav>
                <button class="lg:hidden flex flex-col ml-4">
                    <span class="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
                    </span>
                    <span class="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
                    </span>
                    <span class="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
                    </span>
                </button>
            </div>
        </div>
    </header>
    <div class="bg-white dark:bg-gray-800 flex relative z-20 items-center overflow-hidden">
      <router-view />
    </div>
    </main>
  </div>
  <!--<q-layout>

     <WaterMaker
      :show="true"
      :default-display="true"
      :input-text="authStore.AccessNo"
    ></WaterMaker> -->

    <!-- go-top功能, 一定要放在q-layout的最後一個元件才能保持懸浮在最上方 -->
    <!-- <q-page-scroller
      position="bottom-right"
      :scroll-offset="200"
      :offset="[50, 40]"
      style="z-index: 999;"
    >
      <q-btn fab glossy type="button" icon="arrow_upward" color="green-6" />
    </q-page-scroller> 
  </q-layout>-->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const switchDropbtn = ref(false);
const dropdownRef = ref(null);

const openDropdownbtn = () => {
  switchDropbtn.value = !switchDropbtn.value;
};

const closeDropdown = () => {
  switchDropbtn.value = false;
};

const handleClickOutside = event => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
