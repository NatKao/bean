<template>
  <div>
    <q-card flat bordered class="q-pa-md my-card">
      <q-input
        v-model="socialData.fb"
        label="Facebook Link"
        class="q-mb-md"
        :readonly="isViewer"
        outlined
      >
        <template v-slot:prepend
          ><q-icon name="facebook" color="blue-9"
        /></template>
      </q-input>
      <q-input
        v-model="socialData.ig"
        label="Instagram Link"
        :readonly="isViewer"
        outlined
      >
        <template v-slot:prepend
          ><q-icon name="camera_alt" color="purple"
        /></template>
      </q-input>
      <div class="row justify-end q-mt-md">
        <q-btn
          label="儲存設定"
          color="primary"
          :disable="isViewer"
          icon="save"
        ></q-btn>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useAdminStore } from "@/stores/AdminAuth";

const adminStore = useAdminStore();

const isViewer = computed(() => adminStore.currentRole === "viewer");

const socialData = reactive({
  fb: "https://fb.com",
  ig: "https://instagram.com"
});
</script>
