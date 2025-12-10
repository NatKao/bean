<template>
  <section
    class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
    >
      <div
        class="w-full lg:w-5/12 p-8 md:p-16 flex flex-col justify-center bg-white relative z-10"
      >
        <div
          class="absolute top-0 left-0 w-20 h-20 bg-secondary rounded-br-full opacity-50"
        ></div>
        <h1 class="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
          在水尾民宿
          <br />
          <span class="text-primary">深呼吸</span>
        </h1>
        <p class="text-gray-500 mb-8 leading-relaxed text-lg">
          遠離都市喧囂，感受時間的緩慢流動。
          <br />簡單、純粹、清新的休憩體驗。
        </p>
        <button
          @click="$router.push('/booking')"
          class="w-fit px-8 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 shadow-lg hover:translate-y-[-2px] transition-all"
          >開始旅程</button
        >
      </div>
      <div
        class="w-full lg:w-7/12 bg-gray-50 lg:p-6 flex items-center justify-center relative h-[350px] lg:h-auto"
      >
        <div
          class="hidden lg:grid grid-cols-3 gap-4 w-full h-full max-h-[800px]"
        >
          <div class="flex flex-col gap-4">
            <div
              class="h-40 md:h-56 w-full rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02]"
            >
              <img :src="homeGallery[0]" class="w-full h-full object-cover" />
            </div>
            <div
              class="h-32 md:h-48 w-full rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02]"
            >
              <img :src="homeGallery[1]" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="flex flex-col gap-4 pt-12">
            <div
              class="h-32 md:h-48 w-full rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02]"
            >
              <img :src="homeGallery[2]" class="w-full h-full object-cover" />
            </div>
            <div
              class="h-40 md:h-56 w-full rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02]"
            >
              <img :src="homeGallery[3]" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="flex flex-col gap-4 pt-24">
            <div
              class="h-64 w-full rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02]"
            >
              <img :src="homeGallery[4]" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Mobile/Tablet: Carousel with Swipe (Visible on < lg) -->
        <div
          class="lg:hidden w-full h-full absolute inset-0"
          @touchstart="handleHomeTouchStart"
          @touchend="handleHomeTouchEnd"
        >
          <transition-group
            name="home-fade"
            tag="div"
            class="w-full h-full relative block"
          >
            <div
              v-for="(img, index) in homeGallery"
              :key="img"
              v-show="index === currentHomeSlide"
              class="absolute inset-0 w-full h-full"
            >
              <img
                :src="img"
                class="w-full h-full object-cover"
                alt="Home Slide"
              />
              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
              ></div>
            </div>
          </transition-group>

          <!-- Indicators -->
          <div
            class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10"
          >
            <button
              v-for="(_, idx) in homeGallery"
              :key="idx"
              @click="currentHomeSlide = idx"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300 shadow-sm',
                currentHomeSlide === idx ? 'bg-white w-6' : 'bg-white/50'
              ]"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
import axios from "axios";

// 搬移原本 Home 相關的變數
const currentHomeSlide = ref(0);
const homeGallery = [
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1600"
];

const $baseAxios = inject('$baseAxios');
const message = ref("等待數據...");
// 搬移 API 邏輯
const fetchData = async () => {
  try {
    const response2 = await $baseAxios.get("/users");
    console.log(response2);
    message.value = response2;
  } catch (error) {
    console.error("發生錯誤:", error);
    message.value = "連線失敗";
  }
};

// 搬移 Slideshow 邏輯
let homeTimer;
const startHomeSlideshow = () => {
  clearInterval(homeTimer);
  homeTimer = setInterval(() => {
    currentHomeSlide.value = (currentHomeSlide.value + 1) % homeGallery.length;
  }, 3000);
};

onMounted(() => {
  startHomeSlideshow();
});

onUnmounted(() => {
  clearInterval(homeTimer); // 離開頁面要記得清除 Timer
});

let homeTouchStartX = 0;
const handleHomeTouchStart = e => {
  homeTouchStartX = e.touches[0].clientX;
  clearInterval(homeTimer); // Stop auto play on interact
};
const handleHomeTouchEnd = e => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = homeTouchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // Swipe Left -> Next
      currentHomeSlide.value =
        (currentHomeSlide.value + 1) % homeGallery.length;
    } else {
      // Swipe Right -> Prev
      currentHomeSlide.value =
        (currentHomeSlide.value - 1 + homeGallery.length) % homeGallery.length;
    }
  }
  startHomeSlideshow(); // Restart timer
};
</script>
