<template>
  <section
    class="max-w-4xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
    >
      <div
        class="p-8 md:p-10 border-b border-gray-100 flex-none text-center bg-white z-10"
      >
        <h2 class="text-3xl font-bold text-dark">個人資料</h2>
        <div class="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>
      <div class="p-8 md:p-16 flex-1 flex flex-col justify-start">
        <div class="max-w-lg mx-auto w-full space-y-6">
          <div class="flex flex-col items-center mb-8">
            <div
              class="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-4xl text-primary mb-4"
            >
              <font-awesome-icon :icon="['fas', 'user']" />
            </div>
            <h3 class="text-xl font-bold text-dark">{{ profileForm.name }}</h3>
            <p class="text-gray-500">一般會員</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1"
                >姓名 (不可修改)</label
              >
              <input
                v-model="profileForm.name"
                readonly
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1"
                >電話 (不可修改)</label
              >
              <input
                v-model="profileForm.phone"
                readonly
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >電子信箱</label
              >
              <input
                v-model="profileForm.email"
                type="email"
                placeholder="請輸入電子信箱"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >居住地</label
              >
              <input
                v-model="profileForm.address"
                type="text"
                placeholder="請輸入居住地址"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div class="pt-6">
            <button
              @click="saveProfile"
              class="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-transform hover:scale-[1.02] shadow-md"
            >
              <font-awesome-icon
                :icon="['fas', 'floppy-disk']"
                class="mr-2"
              />儲存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/stores/OcAuth.js";
import { storeToRefs } from "pinia";  // 引入 storeToRefs解構

const userStore = useUserStore(); // 實際要用的
const { currentUser } = storeToRefs(userStore);

const profileForm = ref({ name: "", phone: "", email: "", address: "" });

onMounted(() => {
  Object.assign(profileForm.value, currentUser.value)
});

const saveProfile = () => {
  if (currentUser.value) {
    userStore.updateProfile(profileForm);
    alert("個人資料已更新！");
  }
};
</script>
