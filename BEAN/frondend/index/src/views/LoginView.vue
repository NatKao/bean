<template>
  <section
    class="max-w-md mx-auto w-full p-4 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div class="bg-white rounded-3xl shadow-xl p-8 w-full">
      <h2 class="text-2xl font-bold text-center text-dark mb-8"
        >會員/訂單 登入</h2
      >
      <div class="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button
          @click="loginMode = 'member'"
          :class="[
            'flex-1 py-2 text-sm',
            loginMode === 'member'
              ? 'bg-white shadow text-primary'
              : 'text-gray-500'
          ]"
          >會員登入</button
        >
        <button
          @click="loginMode = 'order'"
          :class="[
            'flex-1 py-2 text-sm',
            loginMode === 'order'
              ? 'bg-white shadow text-primary'
              : 'text-gray-500'
          ]"
          >訂單查詢</button
        >
      </div>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="loginMode === 'member'">
          <input
            v-model="loginForm.phone"
            type="tel"
            maxlength="10"
            placeholder="手機號碼"
            required
            class="w-full px-4 py-3 rounded-xl border mb-4 focus:outline-none focus:border-primary"
          />
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="密碼"
            required
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-primary"
          />
        </div>
        <div v-else>
          <input
            v-model="loginForm.orderId"
            type="text"
            maxlength="8"
            placeholder="訂房編號"
            required
            class="w-full px-4 py-3 rounded-xl border mb-4 focus:outline-none focus:border-primary"
          />
          <input
            v-model="loginForm.phoneLast4"
            type="text"
            maxlength="4"
            placeholder="手機末4碼"
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/OcAuth.js";

const userStore = useUserStore(); // 實際要用的
const router = useRouter();

const loginMode = ref("member");
const loginForm = ref({ phone: "", password: "", orderId: "", phoneLast4: "" });
const loginError = ref("");

const handleLogin = async () => {
    // 呼叫 Store 的 action
    const result = await userStore.login(loginForm.value.phone, loginForm.value.password);
    
    if (result.success) {
        alert("登入成功！");
        router.push("/"); // 或跳轉回上一頁
    } else {
        alert(result.message);
    }
};
</script>
