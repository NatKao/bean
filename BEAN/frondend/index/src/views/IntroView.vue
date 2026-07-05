<!-- 
  File Name: IntroView.vue
  Author: huanyao
  Created Date: 2025-12-07
  Description: 
    此元件用於顯示旅館的房間介紹與環境設施。
    包含頂部的房間切換選單、左側的詳細資訊區塊以及右側的圖片輪播/展示區塊。
    支援手勢滑動切換圖片 (Mobile) 與左右按鈕切換 (Desktop)。
  Reviewed Date: 2025-12-14 huanyao
-->
<template>
  <section
    class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]"
    >
      <!-- Top Scrollable Menu -->
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
        <!-- 1. 關於水尾 (Full Width, No Right Image Slide) -->
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
                <h3 class="font-bold text-lg mb-2">寬敞遊憩空間</h3>
                <p class="text-sm text-gray-600"
                  >打造類公園的舒適環境，適合小朋友自在遊玩、徹底放電。</p
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
                <h3 class="font-bold text-lg mb-2">停車</h3>
                <p class="text-sm text-gray-600"
                  >提供免費自助停車場。(至少可停家用汽車12台或一輛遊覽車)</p
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
                  >12間套房含冷氣，至多入住38人。(歡迎包場)</p
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
                    />房內與衛浴
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
                      />淋浴/浴缸二合一 (附盥洗用品)</li
                    >
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
                  </ul>
                </div>
                <div>
                  <ImageCarousel :images="currentRoom.images" />
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
                  href="tel:0980072867"
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
                      class="lg:text-2xl sm:text-sm font-bold text-dark group-hover:text-primary transition-colors"
                      >0980-072-867</div
                    >
                  </div>
                </a>

                <a
                  class="flex items-center gap-4 bg-white px-8 py-5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-400 hover:shadow-md transition-all group w-full md:w-auto cursor-pointer"
                >
                  <div
                    class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl group-hover:bg-gray-600 group-hover:text-white transition-colors"
                  >
                    <font-awesome-icon
                      :icon="['fab', 'line']"
                      class="text-green-500"
                    />
                  </div>
                  <div class="text-left">
                    <div
                      class="text-xs text-green-500 font-bold uppercase tracking-wider mb-0.5"
                      >Line ID</div
                    >
                    <div class="lg:text-2xl sm:text-sm font-bold text-gray-600">McBean</div>
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

        <!-- 2. 環境公共設施 (999) - 特殊排版 -->
        <template v-else-if="currentRoom.id == '999'">
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

              <div class="space-y-6">
                <div
                  v-if="currentRoom.content && currentRoom.content.length > 0"
                >
                  <div class="flex flex-col gap-4">
                    <div
                      v-for="(item, index) in currentRoom.content"
                      :key="index"
                    >
                      <!-- 改動部分: 調整樣式，將描述放在標題下方 -->
                      <template
                        v-if="typeof item === 'object' && item.type === 'desc'"
                      >
                        <div class="flex flex-col">
                          <div
                            class="flex items-center text-gray-700 font-medium text-lg"
                          >
                            <span
                              class="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0"
                            ></span>
                            {{ item.title }}
                          </div>
                          <!-- 描述區塊 -->
                          <div
                            class="pl-5 mt-1 text-sm text-gray-500 space-y-1"
                          >
                            <p
                              v-for="descLine in item.desc"
                              :key="descLine"
                              class="leading-relaxed"
                            >
                              {{ descLine }}
                            </p>
                          </div>
                        </div>
                      </template>
                      <!-- 一般項目 -->
                      <template v-else>
                        <div class="flex items-center text-gray-700 text-lg">
                          <span
                            class="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0"
                          ></span>
                          {{ item }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side: Single Image Loop -->
          <div
            class="w-full md:w-7/12 bg-gray-50 p-6 flex items-center justify-center relative group select-none h-[500px] md:h-auto"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <div
              class="w-full h-full rounded-2xl overflow-hidden shadow-lg relative bg-gray-200"
            >
              <transition name="img-fade">
                <img
                  :key="currentDisplayImage"
                  :src="currentDisplayImage"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </transition>
            </div>

            <!-- Navigation Controls -->
            <div
              class="absolute inset-0 pointer-events-none flex justify-between items-center px-4 z-20"
            >
              <button
                @click="manualChange(-1)"
                class="pointer-events-auto bg-white/80 backdrop-blur text-gray-800 p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hover:bg-white"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
              </button>
              <button
                @click="manualChange(1)"
                class="pointer-events-auto bg-white/80 backdrop-blur text-gray-800 p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hover:bg-white"
              >
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
            </div>
          </div>
        </template>

        <!-- 3. 一般房型 (Other Rooms) -->
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
                <p
                  v-show="currentRoom.desc"
                  class="text-gray-600 leading-relaxed text-lg"
                  :class="currentRoom.id === '700' ?'text-red-500' : '' "
                  >{{ currentRoom.desc }}</p
                >

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

                <div class="space-y-6">
                  <div
                    v-if="
                      currentRoom.addTimes && currentRoom.addTimes.length > 0
                    "
                  >
                    <h3
                      class="font-bold text-dark mb-4 flex items-center text-lg"
                    >
                      可提供加價項目
                    </h3>
                    <div class="flex flex-col gap-4">
                      <div
                        v-for="(item, index) in currentRoom.addTimes"
                        :key="index"
                      >
                        <!-- 改動部分: 調整樣式，將描述放在標題下方 -->
                        <template
                          v-if="
                            typeof item === 'object' && item.type === 'desc'
                          "
                        >
                          <div class="flex flex-col">
                            <div
                              class="flex items-center text-gray-500 font-medium text-lg"
                            >
                              <span
                                class="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0"
                              ></span>
                              {{ item.title }}
                            </div>
                            <!-- 描述區塊 -->
                            <div
                              class="pl-5 mt-1 text-sm text-gray-400 space-y-1"
                            >
                              <p
                                v-for="descLine in item.desc"
                                :key="descLine"
                                class="leading-relaxed"
                              >
                                {{ descLine }}
                              </p>
                            </div>
                          </div>
                        </template>
                        <!-- 一般項目 -->
                        <template v-else>
                          <div class="flex items-center text-gray-700 text-lg">
                            <span
                              class="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0"
                            ></span>
                            {{ item }}
                          </div>
                        </template>
                      </div>
                    </div>
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

          <!-- Right Side: Single Image Loop -->
          <div
            class="w-full md:w-7/12 bg-gray-50 p-6 flex items-center justify-center relative group select-none h-[500px] md:h-auto"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <div
              class="w-full h-full rounded-2xl overflow-hidden shadow-lg relative bg-gray-200"
            >
              <transition name="img-fade">
                <img
                  :key="currentDisplayImage"
                  :src="currentDisplayImage"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </transition>
            </div>

            <!-- Navigation Controls -->
            <div
              class="absolute inset-0 pointer-events-none flex justify-between items-center px-4 z-20"
            >
              <button
                @click="manualChange(-1)"
                class="pointer-events-auto bg-white/90 text-gray-800 p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hover:bg-white"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
              </button>
              <button
                @click="manualChange(1)"
                class="pointer-events-auto bg-white/90 text-gray-800 p-4 rounded-full shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hover:bg-white"
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
import { ref, reactive, watch, computed, onMounted, onUnmounted } from "vue";
import ImageCarousel from "@/components/component/ImageCarousel.vue";

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
  notProvidedAry = ["一次性備品", "嬰兒床"],
  addTimesAry = [
    {
      type: "desc",
      title: "加床",
      desc: ["新台幣 800/人（含棉被一條及枕頭一個）"]
    },
    {
      type: "desc",
      title: "額外備品（如枕頭及棉被）",
      desc: ["每項新台幣 500元/個"]
    }
  ];

const roomsData = reactive([
  {
    id: "100",
    shortName: "關於水尾",
    name: "關於水尾",
    specs: "",
    desc: "",
    amenities: [],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200"
    ]
  },
  {
    id: "200",
    shortName: "雙人房",
    name: "雙人房",
    specs: "1 張標準雙人床",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    addTimes: addTimesAry,
    images: [
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0063.jpg",
      "https://watertailhomestay.github.io/images/illustrations/201/IMG_0071.jpg"
    ]
  },
  {
    id: "400",
    shortName: "四人房",
    name: "四人房",
    specs: "2 張標準雙人床",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    addTimes: addTimesAry,
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0471.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  },
  {
    id: "600",
    shortName: "六人房",
    name: "六人房",
    specs: "3 張標準雙人床",
    desc: "",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    addTimes: addTimesAry,
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0506.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  },
  {
    id: "700",
    shortName: "太空艙*",
    name: "太空艙*",
    specs: "1 張標準雙人床",
    desc: "此房型為包場後才可加購，不單獨預定",
    amenities: amenitiesAry,
    notProvided: notProvidedAry,
    addTimes: [],
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0506.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  },
  {
    id: "999",
    shortName: "環境公共設施",
    name: "環境公共設施",
    specs: "",
    desc: "",
    content: [
      "卡拉ＯＫ設備",
      "麻將桌",
      "廚房",
      {
        type: "desc",
        title: "泳池",
        desc: ["每年四月至十一月開放"]
      },
      {
        type: "desc",
        title: "烤肉區",
        desc: [
          "僅可使用瓦斯型烤肉架",
          "民宿提供租用瓦斯型美式烤肉架新台幣1,500元/次"
        ]
      }
    ],
    notProvided: [],
    images: [
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0506.jpg",
      "https://watertailhomestay.github.io/images/illustrations/301/IMG_0482.jpg"
    ]
  }
]);

const activeRoomIndex = ref(0);
const currentRoom = computed(() => roomsData[activeRoomIndex.value]);

onMounted(() => {
  loadImages();
  startSlideshow();
});

const loadImages = () => {
  // 關於水尾
  const imgModules0 = import.meta.glob("@/assets/images/img_about_*.{jpg,jpeg,png,webp}", { 
    eager: true, 
    import: 'default' 
  });
  roomsData[0].images = [];
  roomsData[0].images = Object.values(imgModules0);
  // 兩人房
  const imgModules1 = import.meta.glob("@/assets/images/img_room2_*.{jpg,jpeg,png,webp}", { 
    eager: true, 
    import: 'default' 
  });
  roomsData[1].images = [];
  roomsData[1].images = Object.values(imgModules1);
  // 四人房
  const imgModules2 = import.meta.glob("@/assets/images/img_room4_*.{jpg,jpeg,png,webp}", { 
    eager: true, 
    import: 'default' 
  });
  roomsData[2].images = [];
  roomsData[2].images = Object.values(imgModules2);
  // 六人房
  const imgModules3 = import.meta.glob("@/assets/images/img_room6_*.{jpg,jpeg,png,webp}", { 
    eager: true, 
    import: 'default' 
  });
  roomsData[3].images = [];
  roomsData[3].images = Object.values(imgModules3);
  // 太空艙
  const imgModules4 = import.meta.glob("@/assets/images/img_sroom_*.{jpg,jpeg,png,webp}", { 
    eager: true, 
    import: 'default' 
  });
  roomsData[4].images = [];
  roomsData[4].images = Object.values(imgModules4);
  // 公共環境
  const imgModules5 = import.meta.glob("@/assets/images/img_public_*.{jpg,jpeg,png,webp}", { 
    eager: true, 
    import: 'default' 
  });
  roomsData[5].images = [];
  roomsData[5].images = Object.values(imgModules5);
};


onUnmounted(() => {
  stopSlideshow();
});

// --- Single Image Slideshow Logic ---
const currentImageIndex = ref(0);
let slideshowTimer;

const currentDisplayImage = computed(() => {
  if (currentRoom.value.images && currentRoom.value.images.length > 0) {
    return currentRoom.value.images[currentImageIndex.value];
  }
  return "";
});

const startSlideshow = () => {
  stopSlideshow();
  slideshowTimer = setInterval(() => {
    if (currentRoom.value.images && currentRoom.value.images.length > 0) {
      currentImageIndex.value =
        (currentImageIndex.value + 1) % currentRoom.value.images.length;
    }
  }, 4000); // 4 seconds per slide
};

const stopSlideshow = () => {
  if (slideshowTimer) clearInterval(slideshowTimer);
};

// Reset index when changing rooms
watch(activeRoomIndex, () => {
  currentImageIndex.value = 0;
});

const manualChange = direction => {
  stopSlideshow(); // Pause auto play on interaction
  const len = currentRoom.value.images ? currentRoom.value.images.length : 0;
  if (len === 0) return;

  let newIdx = currentImageIndex.value + direction;
  if (newIdx >= len) newIdx = 0;
  if (newIdx < 0) newIdx = len - 1;

  currentImageIndex.value = newIdx;
  startSlideshow(); // Restart timer
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
    if (diff > 0) manualChange(1); // Swipe Left -> Next
    else manualChange(-1); // Swipe Right -> Prev
  } else {
    startSlideshow(); // Restart even if no swipe
  }
};

// --- Tab Scrolling Logic ---
const scrollContainer = ref(null);
const scroll = direction => {
  if (scrollContainer.value) {
    const scrollAmount = 200;
    if (direction === "left") {
      scrollContainer.value.scrollLeft -= scrollAmount;
    } else {
      scrollContainer.value.scrollLeft += scrollAmount;
    }
  }
};
</script>
