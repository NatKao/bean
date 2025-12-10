<template>
  <section
    class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]"
    >
      <div
        class="relative w-full border-b border-gray-100 bg-white group flex-none"
      >
        <button
          @click="scroll('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-gray-50 hidden md:group-hover:block transition-all"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-left']"
            class="text-gray-600"
          />
        </button>

        <div
          ref="scrollContainer"
          class="flex flex-nowrap gap-3 p-4 overflow-x-auto no-scrollbar scroll-smooth items-center"
        >
          <button
            v-for="(room, idx) in roomsData"
            :key="room.id"
            @click="activeRoomIndex = idx"
            :class="[
              'flex-shrink-0 px-6 py-2.5 text-sm font-bold rounded-full border transition-all duration-300 whitespace-nowrap',
              activeRoomIndex === idx
                ? 'bg-primary text-white border-primary shadow-lg scale-105'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            ]"
          >
            {{ room.shortName }}
          </button>
        </div>

        <button
          @click="scroll('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-gray-50 hidden md:group-hover:block transition-all"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-right']"
            class="text-gray-600"
          />
        </button>
      </div>

      <div class="flex-grow flex flex-col md:flex-row">
        <div
          v-if="currentRoom.id === '100'"
          class="w-full p-8 md:p-12 animate-fade-in"
        >
          <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold text-dark mb-6 text-center"
              >關於水尾民宿</h2
            >
            <p
              class="text-gray-600 text-lg leading-relaxed text-center mb-12 max-w-2xl mx-auto"
            >
              位於寧靜的水尾社區，我們提供一個遠離塵囂的休憩空間。無論是家庭旅遊還是朋友聚會，這裡都是您放鬆身心的最佳選擇。
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div
                class="bg-blue-50 p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl"
                >
                  <font-awesome-icon :icon="['fas', 'wifi']" />
                </div>
                <h3 class="font-bold text-lg mb-2">便利設施</h3>
                <p class="text-sm text-gray-600"
                  >全館免費高速
                  WiFi，大廳提供冰箱與飲水機，隨時滿足您的需求。</p
                >
              </div>

              <div
                class="bg-green-50 p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl"
                >
                  <font-awesome-icon :icon="['fas', 'car-side']" />
                </div>
                <h3 class="font-bold text-lg mb-2">停車與充電</h3>
                <p class="text-sm text-gray-600"
                  >提供免費自助停車場，特斯拉車主入住更享免費充電服務。</p
                >
              </div>

              <div
                class="bg-orange-50 p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 text-2xl"
                >
                  <font-awesome-icon :icon="['fas', 'bed']" />
                </div>
                <h3 class="font-bold text-lg mb-2">舒適客房</h3>
                <p class="text-sm text-gray-600"
                  >5
                  間精緻冷氣客房，配備平面電視與免費盥洗用品，給您最舒適的睡眠。</p
                >
              </div>
            </div>

            <div class="border-t border-gray-100 pt-10">
              <h3 class="text-2xl font-bold text-center mb-8">設施一覽</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <h4
                    class="font-bold text-primary mb-4 flex items-center text-lg"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'house']"
                      class="mr-3"
                    />公共區域
                  </h4>
                  <ul class="space-y-3 text-gray-600">
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />冰箱 / 飲水機</li
                    >
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />免費無線上網 (WiFi)</li
                    >
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />免費自助停車</li
                    >
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />特斯拉充電樁</li
                    >
                  </ul>
                </div>
                <div>
                  <h4
                    class="font-bold text-primary mb-4 flex items-center text-lg"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'bath']"
                      class="mr-3"
                    />房內與衛浴
                  </h4>
                  <ul class="space-y-3 text-gray-600">
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />獨立冷氣空調</li
                    >
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />有線頻道平面電視</li
                    >
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />免費瓶裝水 / 快煮壺</li
                    >
                    <li class="flex items-center"
                      ><font-awesome-icon
                        :icon="['fas', 'check']"
                        class="text-green-500 mr-3 w-4"
                      />淋浴/浴缸二合一 (附盥洗用品)</li
                    >
                  </ul>
                </div>
              </div>
            </div>

            <div
              class="mt-16 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8 md:p-12 text-center"
            >
              <h3 class="text-2xl font-bold text-dark mb-3"
                >還在猶豫嗎？歡迎直接聯繫我們</h3
              >
              <p class="text-gray-500 mb-8"
                >我們期待為您解答任何訂房相關問題，為您安排最舒適的假期</p
              >

              <div
                class="flex flex-col md:flex-row items-center justify-center gap-6"
              >
                <a
                  href="tel:0912345678"
                  class="flex items-center gap-4 bg-white px-8 py-5 rounded-2xl shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all group w-full md:w-auto cursor-pointer"
                >
                  <div
                    class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    <font-awesome-icon :icon="['fas', 'mobile-screen']" />
                  </div>
                  <div class="text-left">
                    <div
                      class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5"
                      >Booking Line</div
                    >
                    <div
                      class="text-2xl font-bold text-dark group-hover:text-primary transition-colors"
                      >0912-345-678</div
                    >
                  </div>
                </a>

                <a
                  href="tel:0491234567"
                  class="flex items-center gap-4 bg-white px-8 py-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-400 hover:shadow-md transition-all group w-full md:w-auto cursor-pointer"
                >
                  <div
                    class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl group-hover:bg-gray-600 group-hover:text-white transition-colors"
                  >
                    <font-awesome-icon :icon="['fas', 'phone']" />
                  </div>
                  <div class="text-left">
                    <div
                      class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5"
                      >Tel</div
                    >
                    <div class="text-2xl font-bold text-gray-600"
                      >049-1234567</div
                    >
                  </div>
                </a>
              </div>

              <div
                class="mt-6 flex items-center justify-center text-sm text-gray-400"
              >
                <font-awesome-icon :icon="['far', 'clock']" class="mr-2" />
                電話服務時間：每日 09:00 - 22:00
              </div>
            </div>
          </div>
        </div>

        <template v-else>
          <div
            class="w-full md:w-5/12 flex flex-col bg-white relative z-10 border-r border-gray-100 animate-fade-in"
          >
            <div class="p-8 md:p-12 flex-1 overflow-y-auto">
              <h2 class="text-3xl font-bold text-dark mb-2">{{
                currentRoom.name
              }}</h2>
              <p class="text-sm text-primary font-medium mb-6">{{
                currentRoom.specs
              }}</p>

              <div class="space-y-8">
                <p class="text-gray-600 leading-relaxed text-lg">{{
                  currentRoom.desc || "暫無詳細描述"
                }}</p>

                <div
                  v-if="
                    currentRoom.amenities && currentRoom.amenities.length > 0
                  "
                >
                  <h3
                    class="font-bold text-dark mb-4 flex items-center text-lg"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'wand-magic-sparkles']"
                      class="mr-2 text-primary"
                    />
                    客房設施
                  </h3>
                  <div class="grid grid-cols-2 gap-3">
                    <span
                      v-for="item in currentRoom.amenities"
                      :key="item"
                      class="text-gray-600 flex items-center"
                    >
                      <span
                        class="w-2 h-2 bg-secondary rounded-full mr-3"
                      ></span>
                      {{ item }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="
                    currentRoom.notProvided &&
                    currentRoom.notProvided.length > 0
                  "
                  class="pt-6 border-t border-gray-100"
                >
                  <h3
                    class="font-bold text-gray-400 mb-4 flex items-center text-lg"
                  >
                    <font-awesome-icon :icon="['fas', 'ban']" class="mr-2" />
                    本房型不提供
                  </h3>
                  <div class="grid grid-cols-2 gap-3">
                    <span
                      v-for="item in currentRoom.notProvided"
                      :key="item"
                      class="text-gray-400 flex items-center decoration-gray-300"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'xmark']"
                        class="w-4 h-4 mr-2 opacity-50"
                      />
                      {{ item }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="w-full md:w-7/12 bg-gray-50 p-6 flex gap-4 min-h-[500px] relative group select-none"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <div
              class="flex-1 rounded-2xl overflow-hidden shadow-lg relative bg-gray-200"
            >
              <transition name="img-fade">
                <img
                  :key="introImg1"
                  :src="introImg1"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </transition>
            </div>

            <div
              class="absolute inset-0 pointer-events-none flex justify-between items-center px-4 z-20"
            >
              <button
                @click="manualChange(-1)"
                class="pointer-events-auto bg-white/90 text-gray-800 p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
              </button>
              <button
                @click="manualChange(1)"
                class="pointer-events-auto bg-white/90 text-gray-800 p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const amenitiesAry = [
    "空調",
    "書桌",
    "遮光窗簾",
    "有線平面電視",
    "免費盥洗用品",
    "吹風機/拖鞋",
    "電熱水壺/瓶裝水",
    "私人浴室(浴缸/淋浴)"
  ],
  notProvidedAry = ["加床/折疊床", "嬰兒床"];

const roomsData = [
  {
    id: "100",
    shortName: "關於水尾",
    name: "關於水尾",
    specs: "",
    desc: "",
    amenities: [],
    notProvided: [],
    images: [
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0063.jpg",
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0071.jpg"
    ]
  },
  {
    id: "201",
    shortName: "雙人房 (201)",
    name: "雙人房 (201)",
    specs: "1 張標準雙人床 | 最多入住 3 人",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    images: [
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0063.jpg",
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0071.jpg"
    ]
  },
  {
    id: "202",
    shortName: "雙人房 (202)",
    name: "雙人房 (202)",
    specs: "1 張標準雙人床 | 最多入住 8 人",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    images: [
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0063.jpg",
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0071.jpg"
    ]
  },
  {
    id: "301",
    shortName: "三人房 (301)",
    name: "三人房 (301)",
    specs: "1 張標準雙人床 | 最多入住 6 人",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0471.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  },
  {
    id: "302",
    shortName: "三人房 (302)",
    name: "三人房 (302)",
    specs: "1 張標準雙人床 | 最多入住 6 人",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0506.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  },
  {
    id: "30",
    shortName: "三人房 (303)",
    name: "三人房 (303)",
    specs: "1 張標準雙人床 | 最多入住 4 人",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
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
    desc: "在星空下與親朋好友享受烤肉樂趣，提供完善的烤肉架與清洗設備，食材需自備。",
    amenities: ["烤肉架", "洗手台", "夜間照明", "垃圾桶", "用餐桌椅"],
    notProvided: ["食材", "生火工具", "烤網"],
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

const scrollContainer = ref(null);

// 2. 滑動函式
const scroll = direction => {
  if (scrollContainer.value) {
    const scrollAmount = 200; // 每次滑動的距離 (像素)
    if (direction === "left") {
      scrollContainer.value.scrollLeft -= scrollAmount;
    } else {
      scrollContainer.value.scrollLeft += scrollAmount;
    }
  }
};

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
