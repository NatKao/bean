<template>
  <div
    class="fullscreen login-bg flex flex-center q-pa-md"
    style="z-index: 9999"
  >
    <q-card
      style="width: 100%; max-width: 400px; border-radius: 16px"
      class="shadow-24"
    >
      <q-card-section class="bg-white q-pt-xl q-pb-lg text-center">
        <div class="text-h4 text-weight-bold text-primary q-mb-sm"
          >AdminPro</div
        >
        <div class="text-grey-6">後台管理系統</div>
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-none q-pb-xl">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="form.username"
            label="帳號"
            lazy-rules
            :rules="[val => (val && val.length > 0) || '請輸入帳號']"
          >
            <template v-slot:prepend><q-icon name="person" /></template>
          </q-input>

          <q-input
            filled
            type="password"
            v-model="form.password"
            label="密碼"
            lazy-rules
            :rules="[val => (val && val.length > 0) || '請輸入密碼']"
          >
            <template v-slot:prepend><q-icon name="lock" /></template>
          </q-input>

          <div class="row items-center justify-between q-mt-sm">
            <q-checkbox
              v-model="form.remember"
              label="記住我"
              dense
              color="primary"
              class="text-grey-8"
              size="sm"
            ></q-checkbox>
          </div>

          <q-btn
            label="登入系統"
            type="submit"
            color="primary"
            class="full-width q-mt-lg"
            size="lg"
            unelevated
            :loading="loading"
          ></q-btn>
        </q-form>

        <div class="text-center q-mt-md">
          <div class="text-grey-5 text-caption"
            >預設帳號: admin / 密碼: admin</div
          >
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/AdminAuth";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const adminStore = useAdminStore();

const loading = ref(false);
const form = reactive({
  username: "",
  password: "",
  remember: false
});

const onSubmit = async () => {
  loading.value = true;
  try {
    await adminStore.login(form.username, form.password);
    $q.notify({ message: "登入成功", color: "positive", icon: "check" });
    router.push("/admin/dashboard");
  } catch (error) {
    $q.notify({
      message: error.message || "登入失敗",
      color: "negative",
      icon: "warning"
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-bg {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
