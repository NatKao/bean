<template>
  <div>
    <div class="text-h5 q-mb-md">地理位置與交通</div>
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-sm">基本資訊</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="locationData.address"
            label="地址"
            outlined
            :readonly="isViewer"
          ></q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="locationData.mapUrl"
            label="Google Maps 連結"
            outlined
            :readonly="isViewer"
          ></q-input>
        </div>
      </div>

      <q-separator class="q-my-md"></q-separator>

      <div class="row items-center justify-between q-mb-sm">
        <div class="text-h6">交通方式</div>
        <q-btn
          label="新增方式"
          size="sm"
          color="secondary"
          :disable="isViewer"
          @click="addTransport"
        ></q-btn>
      </div>

      <div
        v-for="(trans, idx) in locationData.transports"
        :key="idx"
        class="row q-col-gutter-sm q-mb-sm items-center bg-grey-2 q-pa-sm rounded-borders"
      >
        <div class="col-12 col-md-3">
          <q-input
            v-model="trans.type"
            dense
            bg-color="white"
            outlined
            label="方式 (如: 高鐵)"
            :readonly="isViewer"
          ></q-input>
        </div>
        <div class="col-12 col-md-8">
          <q-input
            v-model="trans.desc"
            dense
            bg-color="white"
            outlined
            label="詳細說明"
            :readonly="isViewer"
          ></q-input>
        </div>
        <div class="col-12 col-md-1 text-right">
          <q-btn
            flat
            round
            icon="delete"
            color="negative"
            dense
            :disable="isViewer"
            @click="locationData.transports.splice(idx, 1)"
          ></q-btn>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useAdminStore } from "@/stores/AdminAuth";

const adminStore = useAdminStore();

const isViewer = computed(() => adminStore.currentRole === "viewer");

const locationData = reactive({
  address: "台北市信義區測試路100號",
  mapUrl: "https://goo.gl/maps/example",
  transports: [
    { type: "捷運", desc: "搭乘藍線至市政府站 2號出口" },
    { type: "公車", desc: "212, 299 至聯合報大樓站" }
  ]
});
const addTransport = () => locationData.transports.push({ type: "", desc: "" });
</script>
