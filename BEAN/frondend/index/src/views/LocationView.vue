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
          />545南投縣埔里鎮向善路102號
        </p>
        <div class="space-y-6">
          <div class="border-l-4 border-primary pl-4">
            <h4 class="font-bold text-gray-800 text-lg">國道6號</h4>
            <p class="text-sm text-gray-500 mt-2 leading-relaxed"
              >下愛蘭交流道 → 右轉中山路四段 → 右轉善新橋(太陽廟前) → 右轉向善路
              → 抵達。</p
            >
          </div>
          <div class="border-l-4 border-secondary pl-4">
            <h4 class="font-bold text-gray-800 text-lg">台14線</h4>
            <p class="text-sm text-gray-500 mt-2 leading-relaxed"
              >中山路四段 → 左轉善新橋(見太陽廟路口左轉) → 右轉向善路 →
              抵達。</p
            >
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
import { ref, onMounted, onUnmounted } from "vue";
</script>
