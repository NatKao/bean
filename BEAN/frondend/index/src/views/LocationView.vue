<!-- 
  File Name: LocationView.vue
  Author: huanyao
  Created Date: 2025-12-07
  Description: 
    此元件用於顯示地理交通位置。
  Reviewed Date: 2026-01-10 huanyao
-->
<template>
  <section
    class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
    >
      <div
        class="w-full md:w-5/12 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10"
      >
        <h2 class="text-3xl font-bold text-dark mb-6">地理位置</h2>
        <p class="text-gray-600 mb-8 flex items-center">
          <font-awesome-icon
            :icon="['fas', 'location-dot']"
            class="mr-2 text-primary"
          />545 南投縣埔里鎮向善路102號
        </p>
        <div class="space-y-6">
          <div v-for="(locItem,i) in locationAry" class="border-l-4 border-primary pl-4" :key="i">
            <h4 class="font-bold text-gray-800 text-lg">{{ locItem.title }}</h4>
            <p class="text-sm text-gray-500 mt-2 leading-relaxed">{{ locItem.goto }}</p>
          </div>
        </div>
      </div>
      <div class="w-full md:w-7/12 bg-gray-200 relative min-h-[400px]">
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          style="border: 0"
          src="https://maps.google.com/maps?q=545南投縣埔里鎮向善路102號&t=&z=15&ie=UTF8&iwloc=&output=embed"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const locationAry = ref([
  {
    title: "Plus Code",
    goto: "XWQF+3J"
  },
  {
    title: "經緯度",
    goto: "東經：120°92'40.47\" 北緯：23°98'77.48\""
  },
  {
    title: "國道6號",
    goto: "下北山交流道 → 右轉中正路四段 → 左轉善新橋(太陽廟前) → 右轉向善路 → 抵達。"
  }
]);
</script>
