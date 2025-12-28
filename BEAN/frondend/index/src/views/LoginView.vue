<template>
  <section
    class="max-w-md mx-auto w-full p-4 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div class="bg-white rounded-3xl shadow-xl p-8 w-full">
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="代號"
            required
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 mt-4"
          >送出</button
        >
      </form>
      <div v-if="loginError" class="mt-4 text-red-500 text-sm text-center">{{
        loginError
      }}</div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/OcAuth.js";

const $msg = inject('$msg')
const userStore = useUserStore(); // 實際要用的
const router = useRouter();

const loginForm = ref({ password: "" });
const loginError = ref("");

const GAS_URL = "https://script.google.com/macros/s/AKfycbxHmyWAzLRqm6NBDzBte9v4BaA-06FYiJ0WrVtHnOE8NRrAe3kmSn713t1wYrlfLy8Q/exec";

const handleLogin = async () => {
  const loginData = {
    action: "login",
    password: loginForm.value.password
  };
  try {
    $msg.showLoading();
    const response = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(loginData)
    }); 

    const data = await response.json();
    console.log("讀取到的資料:", data);
    $msg.hideLoading();
    if (data.status == "success") {
      $msg.notify.success(data.msg)
      router.push("/profile"); // 或跳轉回上一頁
    } else {
      $msg.alert.error(data.msg);
    }

  } catch (error) {
    console.error(error);
    $msg.hideLoading();
    $msg.notify.error('讀取失敗', '無法連線到DB');
  }
};
</script>
