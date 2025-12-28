<!-- 
  File Name: ImageCarousel.vue
  Author: Gemini
  Created Date: 2025-12-14
  Description: 
    通用的圖片輪播元件。
    支援單張圖片循環播放、自動播放、左右按鈕切換、手勢滑動切換。
    接收 images (Array) 作為參數。
-->
<template>
  <div
    class="relative w-full h-full group select-none overflow-hidden bg-gray-200"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @mouseenter="stopSlideshow"
    @mouseleave="startSlideshow"
  >
    <!-- Image Display -->
    <div class="w-full h-full relative">
      <transition name="carousel-fade">
        <img
          v-if="currentImage"
          :key="currentImage"
          :src="currentImage"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-105"
          alt="Slide Image"
        />
      </transition>

      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
      ></div>
    </div>

    <!-- Navigation Controls (Arrows) -->
    <div
      v-if="images.length > 1"
      class="absolute inset-0 pointer-events-none flex justify-between items-center px-4 z-20"
    >
      <button
        @click="manualChange(-1)"
        class="pointer-events-auto bg-white/80 backdrop-blur-sm text-gray-800 p-3 md:p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hover:bg-white focus:outline-none"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <button
        @click="manualChange(1)"
        class="pointer-events-auto bg-white/80 backdrop-blur-sm text-gray-800 p-3 md:p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hover:bg-white focus:outline-none"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>

    <!-- Indicators (Dots) -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20"
    >
      <button
        v-for="(_, idx) in images"
        :key="idx"
        @click="goToSlide(idx)"
        :class="[
          'block h-1.5 rounded-full transition-all duration-300',
          idx === currentIndex
            ? 'bg-white w-6'
            : 'bg-white/50 w-1.5 hover:bg-white/80'
        ]"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  interval: {
    type: Number,
    default: 4000 // 4 seconds
  }
});

const currentIndex = ref(0);
let timer = null;

const currentImage = computed(() => {
  if (props.images && props.images.length > 0) {
    return props.images[currentIndex.value];
  }
  return "";
});

// --- Slideshow Logic ---
const startSlideshow = () => {
  stopSlideshow();
  if (props.images.length > 1) {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.images.length;
    }, props.interval);
  }
};

const stopSlideshow = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const manualChange = direction => {
  stopSlideshow();
  const len = props.images.length;
  if (len <= 1) return;

  let newIdx = currentIndex.value + direction;
  if (newIdx >= len) newIdx = 0;
  if (newIdx < 0) newIdx = len - 1;

  currentIndex.value = newIdx;
  // Restart is handled by @mouseleave, but we can restart after delay if needed
};

const goToSlide = index => {
  stopSlideshow();
  currentIndex.value = index;
};

// --- Swipe Logic ---
let touchStartX = 0;

const handleTouchStart = e => {
  touchStartX = e.touches[0].clientX;
  stopSlideshow();
};

const handleTouchEnd = e => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > 50) {
    // Threshold
    if (diff > 0) manualChange(1); // Swipe Left -> Next
    else manualChange(-1); // Swipe Right -> Prev
  }

  // Restart slideshow if user lifts finger (optional, currently relying on mouseleave logic for desktop, mobile might need explicit restart)
  startSlideshow();
};

// --- Lifecycle & Watchers ---
// Reset index if images change (e.g., room switch)
watch(
  () => props.images,
  () => {
    currentIndex.value = 0;
    startSlideshow();
  }
);

onMounted(() => {
  startSlideshow();
});

onUnmounted(() => {
  stopSlideshow();
});
</script>

<style scoped>
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 1s ease;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}

.carousel-fade-enter-to,
.carousel-fade-leave-from {
  opacity: 1;
}
</style>
