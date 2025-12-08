<template>
  <section
    class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
    >
      <div
        class="w-full md:w-5/12 flex flex-col bg-white relative z-10 border-r border-gray-100"
      >
        <div
          class="flex overflow-x-auto no-scrollbar border-b border-gray-100 flex-none"
        >
          <button
            v-for="(room, idx) in roomsData"
            :key="room.id"
            @click="activeRoomIndex = idx"
            :class="[
              'flex-1 min-w-[100px] px-2 py-4 text-sm font-bold whitespace-nowrap transition-colors text-center',
              activeRoomIndex === idx
                ? 'text-white bg-primary'
                : 'text-gray-500 hover:bg-gray-50'
            ]"
            >{{ room.shortName }}</button
          >
        </div>
        <div class="p-8 md:p-12 flex-1">
          <h2 class="text-3xl font-bold text-dark mb-2">{{
            currentRoom.name
          }}</h2>
          <p class="text-sm text-primary font-medium mb-6">{{
            currentRoom.specs
          }}</p>
          <div class="space-y-6">
            <p class="text-gray-600 leading-relaxed">{{ currentRoom.desc }}</p>
            <div>
              <h3 class="font-bold text-dark mb-3 flex items-center">
                <font-awesome-icon
                  :icon="['fas', 'wand-magic-sparkles']"
                  class="mr-2 text-primary"
                />客房設施
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <span
                  v-for="item in currentRoom.amenities"
                  :key="item"
                  class="text-sm text-gray-500 flex items-center"
                >
                  <span
                    class="w-1.5 h-1.5 bg-secondary rounded-full mr-2"
                  ></span>
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Dual Independent Slideshow with Manual Controls & Swipe -->
      <div
        class="w-full md:w-7/12 bg-gray-50 p-6 flex gap-4 min-h-[500px] relative group select-none"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- Images -->
        <div
          class="flex-1 rounded-2xl overflow-hidden shadow-lg relative bg-gray-200"
        >
          <transition name="img-fade">
            <img
              :key="introImg1"
              :src="introImg1"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </transition>
        </div>
        <div
          class="flex-1 rounded-2xl overflow-hidden shadow-lg relative bg-gray-200 mt-12 mb-[-3rem]"
        >
          <transition name="img-fade">
            <img
              :key="introImg2"
              :src="introImg2"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </transition>
        </div>

        <!-- Navigation Overlay Controls -->
        <div
          class="absolute inset-0 pointer-events-none flex justify-between items-center px-4"
        >
          <button
            @click="manualChange(-1)"
            class="pointer-events-auto bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform transition-all hover:scale-110 focus:outline-none backdrop-blur-sm opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 opacity-100"
          >
            <font-awesome-icon
              :icon="['fas', 'chevron-left']"
              class="text-lg"
            />
          </button>
          <button
            @click="manualChange(1)"
            class="pointer-events-auto bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform transition-all hover:scale-110 focus:outline-none backdrop-blur-sm opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 opacity-100"
          >
            <font-awesome-icon
              :icon="['fas', 'chevron-right']"
              class="text-lg"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const roomsData = [
  {
    id: "201",
    shortName: "雙人房 (201)",
    name: "溫馨雙人房 (201)",
    specs: "1 張標準雙人床 | 最多入住 3 人",
    desc: "適合情侶或摯友，擁有獨立陽台與舒適空間，配備完善設施，讓您在埔里享受寧靜夜晚。",
    amenities: [
      "空調",
      "私人浴室",
      "平面電視",
      "免費盥洗用品",
      "吹風機",
      "電熱水壺",
      "遮光窗簾",
      "書桌"
    ],
    images: [
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0063.jpg",
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0071.jpg"
    ]
  },
  {
    id: "301",
    shortName: "三人房 (301)",
    name: "溫馨三人房 (301)",
    specs: "1 張標準雙人床 (可加床) | 最多入住 6 人",
    desc: "寬敞舒適的空間配置，適合小家庭或三五好友一同出遊，提供浴缸可放鬆身心。",
    amenities: [
      "空調",
      "私人浴室",
      "平面電視",
      "免費盥洗用品",
      "吹風機",
      "電熱水壺",
      "免費瓶裝水"
    ],
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0471.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  },
  {
    id: "302",
    shortName: "三人房 (302)",
    name: "溫馨三人房 (302)",
    specs: "1 張標準雙人床 (可加床) | 最多入住 6 人",
    desc: "極具現代感的設計風格，搭配柔和採光，為您提供絕佳的休憩環境，適合親子同遊。",
    amenities: [
      "空調",
      "私人浴室",
      "平面電視",
      "免費盥洗用品",
      "吹風機",
      "電熱水壺",
      "免費瓶裝水",
      "冰箱"
    ],
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0506.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  },
  {
    id: "bbq",
    shortName: "烤肉區",
    name: "戶外烤肉區",
    specs: "需提前預約 | 場地費另計",
    desc: "在星空下與親朋好友享受烤肉樂趣，提供完善的烤肉架與清洗設備，食材可代訂或自備。",
    amenities: ["烤肉架", "洗手台", "夜間照明", "垃圾桶", "用餐桌椅"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
const activeRoomIndex = ref(0);
const currentRoom = computed(() => roomsData[activeRoomIndex.value]);
const idx1 = ref(0),
  idx2 = ref(1);
watch(activeRoomIndex, () => {
  idx1.value = 0;
  idx2.value = 1 % currentRoom.value.images.length;
});

let timer1, timer2, homeTimer;
// Manual Navigation for Intro
const manualChange = direction => {
  clearInterval(timer1);
  clearInterval(timer2); // Stop auto slideshow
  const len = currentRoom.value.images.length;
  if (len === 0) return;

  // Calculate new index
  let newIdx = idx1.value + direction;
  if (newIdx >= len) newIdx = 0;
  if (newIdx < 0) newIdx = len - 1;

  idx1.value = newIdx;
  idx2.value = (newIdx + 1) % len;
};

// Swipe Logic for Intro
let touchStartX = 0;
const handleTouchStart = e => {
  touchStartX = e.touches[0].clientX;
};
const handleTouchEnd = e => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    // Threshold 50px
    if (diff > 0) manualChange(1);
    // Swipe Left -> Next
    else manualChange(-1); // Swipe Right -> Prev
  }
};
</script>
