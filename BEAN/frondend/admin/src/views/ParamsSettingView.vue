<template>
  <div>
    <q-card flat bordered class="q-pa-md my-card">
      <q-toggle
        v-model="paramsData.maintenance"
        label="系統維護模式"
        color="red"
        :disable="isViewer"
      ></q-toggle>
      <q-separator class="q-my-md"></q-separator>
      <div class="text-subtitle2 q-mb-sm"
        >稅率設定 ({{ paramsData.taxRate }}%)</div
      >
      <q-slider
        v-model="paramsData.taxRate"
        :min="0"
        :max="15"
        label
        label-always
        color="primary"
        :disable="isViewer"
      ></q-slider>
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

const paramsData = reactive({ maintenance: false, taxRate: 5 });
</script>
