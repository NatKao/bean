<template>
  <div>
    <!-- Nav -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center cursor-pointer" @click="changePage('home')">
            <span class="text-2xl font-bold text-primary tracking-wider">清新旅宿</span>
          </div>
          <div class="hidden md:flex space-x-4 items-center relative">
            <button
              v-for="item in navItems"
              :key="item.id"
              @click="changePage(item.id)"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors', currentPage === item.id ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary']"
            >{{ item.label }}</button>

            <!-- User Button with Dropdown -->
            <div class="relative ml-4">
              <button
                @click="handleUserBtnClick"
                class="px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                <font-awesome-icon :icon="['fas', 'user']" />
                {{ userDisplayLabel }}
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="userMenuOpen && currentUser"
                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in origin-top-right"
              >
                <button
                  @click="changePage('profile')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <font-awesome-icon :icon="['far', 'id-card']" class="w-4" />個人資料
                </button>
                <button
                  @click="changePage('history')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <font-awesome-icon :icon="['fas', 'clock-rotate-left']" class="w-4" />消費紀錄
                </button>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="w-4" />登出
                </button>
              </div>

              <!-- Invisible overlay to close menu when clicking outside -->
              <div
                v-if="userMenuOpen"
                @click="userMenuOpen = false"
                class="fixed inset-0 z-40 cursor-default"
              ></div>
            </div>
          </div>

          <div class="md:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen">
              <font-awesome-icon
                :icon="['fas-solid', mobileMenuOpen ? 'fa-xmark' : 'fa-bars',]"
                :class="['text-xl text-gray-500']"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-50"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="changePage(item.id)"
            class="block w-full text-left px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50"
          >{{ item.label }}</button>
          <div v-if="currentUser" class="border-t border-gray-100 mt-2 pt-2">
            <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">會員專區</div>
            <button
              @click="changePage('profile')"
              class="block w-full text-left px-3 py-3 text-primary font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <font-awesome-icon :icon="['far', 'id-card']" />個人資料
            </button>
            <button
              @click="changePage('history')"
              class="block w-full text-left px-3 py-3 text-primary font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'clock-rotate-left']" />消費紀錄
            </button>
            <button
              @click="handleLogout"
              class="block w-full text-left px-3 py-3 text-red-500 font-medium hover:bg-red-50 flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />登出
            </button>
          </div>
          <button
            v-else
            @click="handleUserBtnClick"
            class="block w-full text-left px-3 py-4 text-primary font-bold border-t border-gray-100"
          >登入</button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow pt-20 pb-24 flex flex-col">
      <!-- Home -->
      <section
        v-if="currentPage === 'home'"
        class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
      >
        <div
          class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
        >
          <div
            class="w-full lg:w-5/12 p-8 md:p-16 flex flex-col justify-center bg-white relative z-10"
          >
            <div class="absolute top-0 left-0 w-20 h-20 bg-secondary rounded-br-full opacity-50"></div>
            <h1 class="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
              在山城埔里
              <br />
              <span class="text-primary">深呼吸</span>
            </h1>
            <p class="text-gray-500 mb-8 leading-relaxed text-lg">
              遠離都市喧囂，感受時間的緩慢流動。
              <br />簡單、純粹、清新的休憩體驗。
            </p>

            <p>後端回應: {{ message }}</p>
            <button @click="fetchData">呼叫後端</button>

            <button
              @click="changePage('booking')"
              class="w-fit px-8 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 shadow-lg hover:translate-y-[-2px] transition-all"
            >開始旅程</button>
          </div>
          <div
            class="w-full lg:w-7/12 bg-gray-50 lg:p-6 flex items-center justify-center relative h-[350px] lg:h-auto"
          >
            <div class="hidden lg:grid grid-cols-3 gap-4 w-full h-full max-h-[800px]">
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
              <transition-group name="home-fade" tag="div" class="w-full h-full relative block">
                <div
                  v-for="(img, index) in homeGallery"
                  :key="img"
                  v-show="index === currentHomeSlide"
                  class="absolute inset-0 w-full h-full"
                >
                  <img :src="img" class="w-full h-full object-cover" alt="Home Slide" />
                  <!-- Gradient Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </transition-group>

              <!-- Indicators -->
              <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                <button
                  v-for="(_, idx) in homeGallery"
                  :key="idx"
                  @click="currentHomeSlide = idx"
                  :class="['w-2 h-2 rounded-full transition-all duration-300 shadow-sm', currentHomeSlide === idx ? 'bg-white w-6' : 'bg-white/50']"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Intro -->
      <section
        v-if="currentPage === 'intro'"
        class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
      >
        <div
          class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
        >
          <div
            class="w-full md:w-5/12 flex flex-col bg-white relative z-10 border-r border-gray-100"
          >
            <div class="flex overflow-x-auto no-scrollbar border-b border-gray-100 flex-none">
              <button
                v-for="(room, idx) in roomsData"
                :key="room.id"
                @click="activeRoomIndex = idx"
                :class="['flex-1 min-w-[100px] px-2 py-4 text-sm font-bold whitespace-nowrap transition-colors text-center', activeRoomIndex === idx ? 'text-white bg-primary' : 'text-gray-500 hover:bg-gray-50']"
              >{{ room.shortName }}</button>
            </div>
            <div class="p-8 md:p-12 flex-1">
              <h2 class="text-3xl font-bold text-dark mb-2">{{ currentRoom.name }}</h2>
              <p class="text-sm text-primary font-medium mb-6">{{ currentRoom.specs }}</p>
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
                      <span class="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>
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
            <div class="flex-1 rounded-2xl overflow-hidden shadow-lg relative bg-gray-200">
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
                <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-lg" />
              </button>
              <button
                @click="manualChange(1)"
                class="pointer-events-auto bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform transition-all hover:scale-110 focus:outline-none backdrop-blur-sm opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 opacity-100"
              >
                <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Rules -->
      <section
        v-if="currentPage === 'rules'"
        class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
      >
        <div class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative">
          <div class="p-8 md:p-10 border-b border-gray-100 flex-none text-center bg-white z-10">
            <h2 class="text-3xl font-bold text-dark">訂房須知</h2>
            <div class="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <div class="p-8 md:p-12">
            <div class="max-w-4xl mx-auto space-y-4">
              <div
                v-for="(rule, index) in rulesData"
                :key="index"
                class="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  @click="rule.isOpen = !rule.isOpen"
                  class="w-full flex justify-between p-5 bg-gray-50 hover:bg-gray-100 items-center"
                >
                  <h3 class="text-lg font-bold text-dark flex items-center">
                    <font-awesome-icon :icon="rule.icon" class="mr-3 text-primary" />
                    {{ rule.title }}
                  </h3>
                  <font-awesome-icon
                    :icon="['fas', 'chevron-down']"
                    :class="['text-gray-400 transition-transform', rule.isOpen ? 'rotate-180' : '']"
                  />
                </button>
                <transition name="accordion">
                  <div v-if="rule.isOpen" class="bg-white p-5 border-t border-gray-100">
                    <ul class="list-disc list-inside space-y-2 text-gray-600 text-sm ml-2">
                      <li v-for="(item, i) in rule.content" :key="i">{{ item }}</li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Location -->
      <section
        v-if="currentPage === 'location'"
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
              <font-awesome-icon :icon="['fas', 'location-dot']" class="mr-2 text-primary" />545南投縣埔里鎮向善路102號
            </p>
            <div class="space-y-6">
              <div class="border-l-4 border-primary pl-4">
                <h4 class="font-bold text-gray-800 text-lg">國道6號</h4>
                <p
                  class="text-sm text-gray-500 mt-2 leading-relaxed"
                >下愛蘭交流道 → 右轉中山路四段 → 右轉善新橋(太陽廟前) → 右轉向善路 → 抵達。</p>
              </div>
              <div class="border-l-4 border-secondary pl-4">
                <h4 class="font-bold text-gray-800 text-lg">台14線</h4>
                <p
                  class="text-sm text-gray-500 mt-2 leading-relaxed"
                >中山路四段 → 左轉善新橋(見太陽廟路口左轉) → 右轉向善路 → 抵達。</p>
              </div>
            </div>
          </div>
          <div class="w-full md:w-7/12 bg-gray-200 relative min-h-[400px]">
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              style="border:0"
              src="https://maps.google.com/maps?q=545南投縣埔里鎮向善路102號&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <!-- Profile Page -->
      <section
        v-if="currentPage === 'profile'"
        class="max-w-4xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
      >
        <div class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
          <div class="p-8 md:p-10 border-b border-gray-100 flex-none text-center bg-white z-10">
            <h2 class="text-3xl font-bold text-dark">個人資料</h2>
            <div class="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <div class="p-8 md:p-16 flex-1 flex flex-col justify-start">
            <div class="max-w-lg mx-auto w-full space-y-6">
              <div class="flex flex-col items-center mb-8">
                <div
                  class="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-4xl text-primary mb-4"
                >
                  <font-awesome-icon :icon="['fas', 'user']" />
                </div>
                <h3 class="text-xl font-bold text-dark">{{ profileForm.name }}</h3>
                <p class="text-gray-500">一般會員</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">姓名 (不可修改)</label>
                  <input
                    v-model="profileForm.name"
                    readonly
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">電話 (不可修改)</label>
                  <input
                    v-model="profileForm.phone"
                    readonly
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">電子信箱</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    placeholder="請輸入電子信箱"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">居住地</label>
                  <input
                    v-model="profileForm.address"
                    type="text"
                    placeholder="請輸入居住地址"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div class="pt-6">
                <button
                  @click="saveProfile"
                  class="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-transform hover:scale-[1.02] shadow-md"
                >
                  <font-awesome-icon :icon="['fas', 'floppy-disk']" class="mr-2" />儲存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- History Page -->
      <section
        v-if="currentPage === 'history'"
        class="max-w-5xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
      >
        <div class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
          <div class="p-8 md:p-10 border-b border-gray-100 flex-none text-center bg-white z-10">
            <h2 class="text-3xl font-bold text-dark">消費紀錄</h2>
            <div class="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <div class="p-6 md:p-12 flex-1 bg-gray-50">
            <div class="max-w-4xl mx-auto space-y-4">
              <div v-if="userHistory.length === 0" class="text-center py-20 text-gray-400">
                <font-awesome-icon :icon="['far', 'folder-open']" class="text-6xl mb-4" />
                <p>目前尚無消費紀錄</p>
              </div>
              <div
                v-else
                v-for="record in userHistory"
                :key="record.id"
                class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                    >已完成</span>
                    <span class="text-gray-400 text-xs">訂單編號: {{ record.id }}</span>
                  </div>
                  <h3 class="text-lg font-bold text-dark mb-1">{{ record.roomType }}</h3>
                  <div class="text-sm text-gray-500 flex flex-wrap gap-4">
                    <span class="flex items-center">
                      <font-awesome-icon :icon="['far', 'calendar']" class="mr-2" />
                      {{ record.checkIn }} ~ {{ record.checkOut }}
                    </span>
                    <span class="flex items-center">
                      <font-awesome-icon :icon="['fas', 'users']" class="mr-2" />
                      {{ record.adults }} 大 {{ record.kids }} 小
                    </span>
                  </div>
                </div>
                <div
                  class="md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6"
                >
                  <div class="text-xs text-gray-400 mb-1">備註</div>
                  <p class="text-sm text-gray-600">{{ record.remarks || '無' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Login -->
      <section
        v-if="currentPage === 'login'"
        class="max-w-md mx-auto w-full p-4 flex items-center justify-center min-h-[calc(100vh-11rem)]"
      >
        <div class="bg-white rounded-3xl shadow-xl p-8 w-full">
          <h2 class="text-2xl font-bold text-center text-dark mb-8">會員/訂單 登入</h2>
          <div class="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button
              @click="loginMode = 'member'"
              :class="['flex-1 py-2 text-sm', loginMode === 'member' ? 'bg-white shadow text-primary' : 'text-gray-500']"
            >會員登入</button>
            <button
              @click="loginMode = 'order'"
              :class="['flex-1 py-2 text-sm', loginMode === 'order' ? 'bg-white shadow text-primary' : 'text-gray-500']"
            >訂單查詢</button>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div v-if="loginMode === 'member'">
              <input
                v-model="loginForm.phone"
                type="tel"
                maxlength="10"
                placeholder="手機號碼"
                required
                class="w-full px-4 py-3 rounded-xl border mb-4 focus:outline-none focus:border-primary"
              />
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="密碼"
                required
                class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-primary"
              />
            </div>
            <div v-else>
              <input
                v-model="loginForm.orderId"
                type="text"
                maxlength="8"
                placeholder="訂房編號"
                required
                class="w-full px-4 py-3 rounded-xl border mb-4 focus:outline-none focus:border-primary"
              />
              <input
                v-model="loginForm.phoneLast4"
                type="text"
                maxlength="4"
                placeholder="手機末4碼"
                required
                class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              class="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 mt-4"
            >送出</button>
          </form>
          <div v-if="loginError" class="mt-4 text-red-500 text-sm text-center">{{ loginError }}</div>
        </div>
      </section>

      <!-- Booking -->
      <section
        v-if="currentPage === 'booking'"
        class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
      >
        <!-- Init Stage -->
        <div
          v-if="bookingStage === 'init' && !currentUser"
          class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]"
        >
          <div class="h-full grid grid-cols-1 lg:grid-cols-2 flex-grow">
            <div
              class="flex flex-col justify-center p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-gray-100"
            >
              <div class="max-w-sm mx-auto w-full space-y-8">
                <div class="text-center">
                  <h1 class="text-4xl font-bold text-gray-800 mb-2">預定入住</h1>
                  <p class="text-gray-500">請填寫以下資訊來預約我們的服務</p>
                </div>
                <div class="space-y-6 mt-10">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">電話</label>
                    <div class="relative">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <font-awesome-icon :icon="['fas', 'phone']" class="text-gray-400" />
                      </div>
                      <input
                        v-model="tempGuestPhone"
                        type="tel"
                        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="請輸入電話號碼"
                        maxlength="10"
                      />
                    </div>
                  </div>
                  <button
                    @click="startGuestBooking"
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >立即預約</button>
                </div>
              </div>
            </div>
            <div class="flex flex-col justify-center p-10 md:p-16 bg-gray-50/50">
              <div class="max-w-sm mx-auto w-full space-y-8">
                <div class="text-center">
                  <h1 class="text-4xl font-bold text-gray-800 mb-2">查詢訂房</h1>
                  <p class="text-gray-500">查詢訂房資訊與匯款資料</p>
                </div>
                <div class="space-y-6 mt-10">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">電話</label>
                    <div class="relative">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <font-awesome-icon :icon="['fas', 'phone']" class="text-gray-400" />
                      </div>
                      <input
                        v-model="loginForm.phoneLast4"
                        type="tel"
                        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="請輸入電話末4碼"
                        maxlength="4"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">訂房序號</label>
                    <div class="relative">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <font-awesome-icon :icon="['fas', 'hashtag']" class="text-gray-400" />
                      </div>
                      <input
                        v-model="loginForm.orderId"
                        type="text"
                        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="請輸入訂房序號"
                        maxlength="8"
                      />
                    </div>
                  </div>
                  <button
                    @click="handleOrderLookup"
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >查詢</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Steps (1-3) -->
        <div
          v-else
          class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative"
        >
          <!-- Step Bar -->
          <div v-if="bookingStage !== 'finish'" class="w-full bg-white border-b border-gray-200">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ol role="list" class="flex overflow-hidden rounded-md lg:rounded-none">
                <li class="lg:flex-1 relative overflow-hidden">
                  <div class="group">
                    <span
                      class="absolute top-auto bottom-0 h-1 w-full"
                      :class="bookingStage >= 1 ? 'bg-indigo-600' : 'bg-gray-200'"
                    ></span>
                    <span class="lg:pl-9 flex items-start px-6 py-5 text-sm font-medium">
                      <span class="flex-shrink-0">
                        <span
                          class="flex h-10 w-10 items-center justify-center rounded-full border-3"
                          :class="bookingStage >= 1 ? 'border-indigo-600' : 'border-gray-300'"
                        >
                          <span
                            :class="bookingStage === 1 ? 'text-indigo-600' : (bookingStage > 1 ? 'text-indigo-600' : 'text-gray-500')"
                          >
                            <font-awesome-icon
                              v-if="bookingStage > 1"
                              :icon="['fas', 'circle-check']"
                              class="text-4xl"
                            />
                            <span v-else>01</span>
                          </span>
                        </span>
                      </span>
                      <!-- Mobile Logic: 僅在 Step 1 未完成或正在進行時顯示文字 (或 lg 以上永遠顯示) -->
                      <span
                        :class="['mt-0.5 ml-4 min-w-0 flex-col', bookingStage > 1 ? 'hidden lg:flex' : 'flex']"
                      >
                        <span
                          class="text-sm font-medium"
                          :class="bookingStage === 1 ? 'text-indigo-600' : 'text-gray-500'"
                        >同意書</span>
                        <span
                          class="text-xs lg:text-sm font-medium text-gray-500 hidden sm:block"
                        >請詳細閱讀</span>
                      </span>
                    </span>
                  </div>
                </li>
                <li class="flex-1 relative overflow-hidden cursor-pointer" @click="goToStep(2)">
                  <div class="group">
                    <span
                      class="absolute top-auto bottom-0 h-1 w-full"
                      :class="bookingStage >= 2 ? 'bg-indigo-600' : 'bg-gray-200'"
                    ></span>
                    <span class="lg:pl-9 flex items-start px-6 py-5 text-sm font-medium">
                      <span class="flex-shrink-0">
                        <span
                          class="flex h-10 w-10 items-center justify-center rounded-full border-3"
                          :class="bookingStage >= 2 ? 'border-indigo-600' : 'border-gray-300'"
                        >
                          <span
                            :class="bookingStage === 2 ? 'text-indigo-600' : (bookingStage > 2 ? 'text-indigo-600' : 'text-gray-500')"
                          >
                            <font-awesome-icon
                              v-if="bookingStage > 2"
                              :icon="['fas', 'circle-check']"
                              class="text-4xl"
                            />
                            <span v-else>02</span>
                          </span>
                        </span>
                      </span>

                      <!-- Mobile Logic: 僅在 Step 2 未完成或正在進行時顯示文字 -->
                      <span
                        :class="['mt-0.5 ml-4 min-w-0 flex-col', bookingStage > 2 ? 'hidden lg:flex' : 'flex']"
                      >
                        <span
                          class="text-sm font-medium"
                          :class="bookingStage === 2 ? 'text-indigo-600' : 'text-gray-500'"
                        >填寫資訊</span>
                        <span
                          class="text-xs lg:text-sm font-medium text-gray-500 hidden sm:block"
                        >入住資料</span>
                      </span>
                    </span>
                  </div>
                </li>
                <li class="flex-1 relative overflow-hidden cursor-pointer" @click="goToStep(3)">
                  <div class="group">
                    <span
                      class="absolute top-auto bottom-0 h-1 w-full"
                      :class="bookingStage >= 3 ? 'bg-indigo-600' : 'bg-gray-200'"
                    ></span>
                    <span class="lg:pl-9 flex items-start px-6 py-5 text-sm font-medium">
                      <span class="flex-shrink-0">
                        <span
                          class="flex h-10 w-10 items-center justify-center rounded-full border-3"
                          :class="bookingStage >= 3 ? 'border-indigo-600' : 'border-gray-300'"
                        >
                          <span :class="bookingStage === 3 ? 'text-indigo-600' : 'text-gray-500'">
                            <font-awesome-icon
                              v-if="bookingStage === 'finish'"
                              :icon="['fas', 'circle-check']"
                              class="text-4xl"
                            />
                            <span v-else>03</span>
                          </span>
                        </span>
                      </span>

                      <!-- Mobile Logic: 總是顯示文字 (因為是最後一步) -->
                      <span class="flex mt-0.5 ml-4 min-w-0 flex-col">
                        <span
                          class="text-sm font-medium"
                          :class="bookingStage === 3 ? 'text-indigo-600' : 'text-gray-500'"
                        >確認資料</span>
                        <span
                          class="text-xs lg:text-sm font-medium text-gray-500 hidden sm:block"
                        >請再確認一次</span>
                      </span>
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <!-- Content Container -->
          <div class="flex-1 p-8 md:p-12">
            <div class="max-w-7xl mx-auto h-full">
              <!-- Step 1: Terms -->
              <div v-if="bookingStage === 1" class="max-w-2xl mx-auto space-y-8 animate-fade-in">
                <div class="text-center">
                  <h1 class="text-3xl font-bold text-gray-800 mb-2">同意書閱讀</h1>
                </div>
                <div class="bg-gray-50 p-6 rounded-md border border-gray-200 space-y-4">
                  <h4 class="font-bold mb-2">住宿同意書內容：</h4>
                  <ul class="list-disc list-inside space-y-2 text-sm text-gray-600">
                    <li>入住時間 (Check-in)：15:00 - 18:00。</li>
                    <li>退房時間 (Check-out)：11:00 以前。</li>
                    <li>室內全面禁菸，違者將收取清潔費。</li>
                    <li>晚間 22:00 後請降低音量。</li>
                    <li>請勿攜帶寵物 (除導盲犬)。</li>
                    <li>取消訂房請參閱退訂政策，入住前 3 天內不退費。</li>
                  </ul>
                </div>
                <div class="flex items-center justify-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    v-model="rulesAccepted"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="remember_me" class="ml-2 block text-sm text-gray-700">上敘已閱讀完畢</label>
                </div>
                <div class="flex justify-center gap-4">
                  <button
                    class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
                    @click="resetBooking"
                  >返回</button>
                  <button
                    :disabled="!rulesAccepted"
                    class="inline-flex text-white bg-indigo-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-700 rounded text-lg disabled:bg-gray-300"
                    @click="nextBookingStep"
                  >同意，並下一個步驟</button>
                </div>
              </div>

              <!-- Step 2: Info & Date -->
              <div
                v-if="bookingStage === 2"
                class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in pb-12"
              >
                <!-- Left: Info Form -->
                <div class="bg-white p-6 shadow-lg rounded-lg h-fit">
                  <div class="mb-6 text-center">
                    <h1 class="text-2xl font-bold text-gray-800">房客資訊</h1>
                    <p class="text-gray-600 mt-1">請輸入以下相關資訊</p>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">電話號碼</label>
                      <div class="relative">
                        <div
                          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                          <font-awesome-icon :icon="['fas', 'phone']" class="text-gray-400" />
                        </div>
                        <input
                          v-model="bookingForm.phone"
                          readonly
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                      <input
                        v-model="bookingForm.name"
                        type="text"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="請輸入真實姓名"
                      />
                    </div>
                    <div>
                      <div class="flex justify-between">
                        <label class="block text-sm font-medium text-gray-700 mb-1">電子信箱</label>
                        <p class="text-xs text-gray-500">非必填</p>
                      </div>
                      <div class="relative">
                        <div
                          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                          <font-awesome-icon :icon="['fas', 'envelope']" class="text-gray-400" />
                        </div>
                        <input
                          v-model="bookingForm.email"
                          type="email"
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <!-- Booking Type Tabs -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">訂房模式</label>
                      <div class="flex rounded-md shadow-sm" role="group">
                        <button
                          type="button"
                          @click="bookingForm.bookingType = 'standard'"
                          :class="['px-4 py-2 text-sm font-medium border rounded-l-lg flex-1 focus:z-10 focus:ring-2 focus:ring-primary', bookingForm.bookingType === 'standard' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']"
                        >一般訂房 (人頭計費)</button>
                        <button
                          type="button"
                          @click="bookingForm.bookingType = 'whole'"
                          :class="['px-4 py-2 text-sm font-medium border rounded-r-lg flex-1 focus:z-10 focus:ring-2 focus:ring-primary', bookingForm.bookingType === 'whole' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50']"
                        >包棟預定 (每日計費)</button>
                      </div>
                    </div>

                    <!-- Pax Counts -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">入住人數</label>

                      <!-- Standard Mode: Adults & Kids -->
                      <div v-if="bookingForm.bookingType === 'standard'">
                        <div
                          class="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                        >
                          <div class="flex items-center gap-2">
                            <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400" />
                            <span class="text-sm text-gray-700">大人 ($2,000/人)</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <button
                              @click="updateCount('adults', -1)"
                              class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                            >-</button>
                            <span class="font-bold w-6 text-center">{{bookingForm.adults}}</span>
                            <button
                              @click="updateCount('adults', 1)"
                              class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                            >+</button>
                          </div>
                        </div>
                        <div
                          class="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 mt-2"
                        >
                          <div class="flex items-center gap-2">
                            <font-awesome-icon :icon="['fas', 'baby']" class="text-gray-400" />
                            <span class="text-sm text-gray-700">小孩 ($1,000/人)</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <button
                              @click="updateCount('kids', -1)"
                              class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                            >-</button>
                            <span class="font-bold w-6 text-center">{{bookingForm.kids}}</span>
                            <button
                              @click="updateCount('kids', 1)"
                              class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                            >+</button>
                          </div>
                        </div>
                      </div>

                      <!-- Whole House Mode: Total People (Just for record) -->
                      <div v-else>
                        <div
                          class="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                        >
                          <div class="flex items-center gap-2">
                            <font-awesome-icon :icon="['fas', 'users']" class="text-gray-400" />
                            <span class="text-sm text-gray-700">總人數 (不影響房價)</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <button
                              @click="updateCount('adults', -1)"
                              class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                            >-</button>
                            <span class="font-bold w-6 text-center">{{bookingForm.adults}}</span>
                            <button
                              @click="updateCount('adults', 1)"
                              class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                            >+</button>
                          </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-1 text-right">* 包棟房價為固定費率 ($20,000/晚)</p>
                      </div>
                    </div>

                    <!-- Selected Date Display (Updated Responsive) -->
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">入住日期</label>
                        <div class="relative">
                          <!-- Desktop: Readonly Text -->
                          <input
                            :value="bookingForm.date || '請選擇'"
                            readonly
                            class="hidden lg:block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm cursor-not-allowed"
                          />

                          <!-- Mobile/Tablet: Native Date Input -->
                          <div class="lg:hidden relative">
                            <input
                              type="date"
                              v-model="bookingForm.date"
                              :min="minDateStr"
                              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm pl-10"
                            />
                            <div
                              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                              <font-awesome-icon
                                :icon="['fas', 'calendar-days']"
                                class="text-gray-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">退房日期</label>
                        <input
                          :value="checkoutDate || ''"
                          readonly
                          class="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                        />
                      </div>
                    </div>

                    <!-- Total Price Display (Conditional) -->
                    <div
                      v-if="totalPrice > 0"
                      class="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex justify-between items-center"
                    >
                      <span class="text-indigo-800 font-medium">訂房總金額</span>
                      <span
                        class="text-2xl font-bold text-indigo-700"
                      >NT$ {{ totalPrice.toLocaleString() }}</span>
                    </div>

                    <div class="flex gap-4 mt-4">
                      <!-- Back Button -->
                      <button
                        @click="bookingStage = 1"
                        class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                      >上一步</button>

                      <!-- Next Button -->
                      <button
                        @click="nextBookingStep"
                        :disabled="!bookingForm.name || !bookingForm.date || (bookingForm.bookingType === 'standard' && bookingForm.adults === 0)"
                        class="flex-[2] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
                      >填寫完畢，並下一個步驟</button>
                    </div>
                  </div>
                </div>

                <!-- Right: Calendar (Custom Implementation) - Hidden on Mobile -->
                <div class="hidden lg:block bg-gray-100 p-6 shadow-lg rounded-lg h-fit">
                  <div class="mb-4 text-center">
                    <h2 class="text-xl font-semibold text-gray-800">入住日期選擇</h2>
                    <p class="text-gray-500 text-sm">請直接點選日期</p>
                  </div>
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <DatePicker
                      ref="big_calendar"
                      expanded
                      v-model.range="range"
                      :attributes="big_attributes"
                      :rows="2"
                      mode="date"
                      :max-date="dayjs().add(1, 'year').format('ddd MMM DD YYYY')"
                      :min-date="dayjs().add(1, 'day').format('ddd MMM DD YYYY')"
                      :locale="{
                      id: 'zh-TW',
                      firstDayOfWeek: 2,
                      masks: { weekdays: 'WW' }
                      }"
                    >
                      <template #bar>
                        <div class="relative bg-orange-100 px-4 py-2 rounded-t-md">
                          <!-- 右上角三角形 -->
                          <div
                            class="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-t-orange-500 border-l-transparent"
                          ></div>
                        </div>
                      </template>
                      <template #footer>
                        <div class="w-full px-4 pb-3">
                          <button
                            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
                            @click="moveToday"
                          >今日</button>
                        </div>
                      </template>
                    </DatePicker>
                  </div>
                </div>
              </div>

              <!-- Step 3: Confirmation -->
              <div
                v-if="bookingStage === 3"
                class="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg animate-fade-in"
              >
                <div class="mb-8 text-center">
                  <h1 class="text-2xl font-bold text-gray-800">預約資訊</h1>
                  <p class="text-gray-600 mt-2">請檢查以下資訊是否正確</p>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'mobile-screen']" class="text-gray-400 mr-2" />
                    <span class="w-20 text-sm font-medium text-gray-700">電話號碼</span>
                    <span>{{ bookingForm.phone }}</span>
                  </div>
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400 mr-2" />
                    <span class="w-20 text-sm font-medium text-gray-700">姓名</span>
                    <span>{{ bookingForm.name }}</span>
                  </div>
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'envelope']" class="text-gray-400 mr-2" />
                    <span class="w-20 text-sm font-medium text-gray-700">電子信箱</span>
                    <span>{{ bookingForm.email || '未填寫' }}</span>
                  </div>
                  <div class="border-t border-gray-100 my-4 pt-4">
                    <div class="flex items-center mb-2">
                      <font-awesome-icon :icon="['fas', 'hotel']" class="text-gray-400 mr-2" />
                      <span class="w-20 text-sm font-medium text-gray-700">訂房模式</span>
                      <span>{{ bookingForm.bookingType === 'standard' ? '一般訂房' : '包棟預定' }}</span>
                    </div>
                    <div class="flex items-center mb-2">
                      <font-awesome-icon :icon="['fas', 'users']" class="text-gray-400 mr-2" />
                      <span class="w-20 text-sm font-medium text-gray-700">入住人數</span>
                      <span>{{ bookingForm.adults }} 大 {{ bookingForm.kids }} 小</span>
                    </div>
                    <div class="flex items-center mb-2">
                      <font-awesome-icon
                        :icon="['fas', 'calendar-days']"
                        class="text-gray-400 mr-2"
                      />
                      <span class="w-20 text-sm font-medium text-gray-700">入住日期</span>
                      <span class="font-bold text-primary">{{ bookingForm.date }}</span>
                    </div>
                    <div class="flex items-center mb-2">
                      <font-awesome-icon
                        :icon="['fas', 'calendar-days']"
                        class="text-gray-400 mr-2"
                      />
                      <span class="w-20 text-sm font-medium text-gray-700">退房日期</span>
                      <span>{{ checkoutDate }}</span>
                    </div>
                    <div class="flex items-center">
                      <font-awesome-icon
                        :icon="['fas', 'money-bill-wave']"
                        class="text-gray-400 mr-2"
                      />
                      <span class="w-20 text-sm font-medium text-gray-700">總金額</span>
                      <span class="font-bold text-indigo-600">NT$ {{ totalPrice.toLocaleString() }}</span>
                    </div>
                  </div>
                  <!-- Note Section (Textarea) -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">訂單備註</label>
                    <textarea
                      v-model="bookingForm.remarks"
                      rows="3"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                      placeholder="如有特殊需求請在此填寫..."
                    ></textarea>
                  </div>
                  <div class="flex items-start mt-6">
                    <input
                      type="checkbox"
                      checked
                      disabled
                      class="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
                    />
                    <span class="ml-3 text-sm text-gray-600">
                      我同意
                      <a href="#" class="text-indigo-600">服務條款</a> 和
                      <a href="#" class="text-indigo-600">隱私權政策</a>
                    </span>
                  </div>

                  <div class="flex gap-4 mt-4">
                    <!-- Back Button -->
                    <button
                      @click="bookingStage = 2"
                      class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >上一步</button>

                    <!-- Confirm Button -->
                    <button
                      @click="finishBooking"
                      class="flex-[2] py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                    >確定預定</button>
                  </div>
                </div>
              </div>

              <!-- Finish (Modified) -->
              <div
                v-if="bookingStage === 'finish'"
                class="text-center animate-fade-in py-12 max-w-lg mx-auto flex flex-col items-center"
              >
                <!-- Large Success Icon -->
                <div class="text-green-500 mb-6">
                  <font-awesome-icon
                    :icon="['fas', 'circle-check']"
                    class="text-7xl shadow-sm rounded-full bg-white"
                  />
                </div>

                <h2 class="text-3xl font-bold mb-2 text-gray-800">預訂成功！</h2>

                <!-- Guest Logic -->
                <template v-if="!currentUser || currentUser.type === 'guest'">
                  <p class="text-gray-500 mb-8">請截圖保存以下資訊</p>
                  <div
                    class="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center w-full mb-6 relative overflow-hidden"
                  >
                    <div
                      class="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg"
                    >訪客訂房</div>
                    <p class="text-sm text-gray-400 mb-2 uppercase tracking-wide">訂房編號</p>
                    <p class="font-mono text-3xl font-bold text-primary mb-6">{{ finalData.id }}</p>

                    <div class="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm text-left">
                      <div class="flex items-start gap-3">
                        <font-awesome-icon :icon="['fas', 'circle-info']" class="mt-1" />
                        <div>
                          <p class="font-bold mb-1">查詢方式</p>
                          <p>
                            請使用
                            <strong>訂房編號</strong> +
                            <strong>電話末四碼</strong> 於「訂房查詢」查詢訂單。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Member Logic -->
                <template v-else>
                  <p class="text-gray-500 mb-8">感謝您的預訂，{{ currentUser.name }}</p>
                  <div
                    class="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center w-full mb-6 relative overflow-hidden"
                  >
                    <div
                      class="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg"
                    >會員訂房</div>
                    <p class="text-sm text-gray-400 mb-2 uppercase tracking-wide">訂房編號</p>
                    <p class="font-mono text-3xl font-bold text-primary mb-6">{{ finalData.id }}</p>

                    <div class="bg-green-50 text-green-700 p-4 rounded-lg text-sm text-left">
                      <div class="flex items-start gap-3">
                        <font-awesome-icon :icon="['fas', 'circle-check']" class="mt-1" />
                        <div>
                          <p class="font-bold mb-1">已歸戶</p>
                          <p>
                            此訂單已儲存至您的帳號，您可隨時至
                            <strong>
                              <a
                                href="#"
                                @click.prevent="changePage('history')"
                                class="underline"
                              >消費紀錄</a>
                            </strong> 查詢。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <button
                  @click="changePage('home');bookingStage='init'"
                  class="w-full mt-2 py-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                >回首頁</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer
      class="fixed bottom-0 left-0 right-0 z-40 bg-dark text-white py-4 text-center text-sm shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
    >545南投縣埔里鎮向善路102號 | Tel: 049-1234567</footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch, inject } from "vue";
import { useUserStore } from "@/stores/OcAuth.js";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

import axios from "axios";
const message = ref("等待數據...");

const $BaseAxios = inject("baseAxios");
const fetchData = async () => {
  try {
    // 因為設定了 Proxy，這裡直接呼叫 /api/hello 即可
    // Vite 會自動幫你轉發到 http://localhost:8080/api/hello
    const response = await axios.get("/api/users");
    console.log(response.data);
    // console.log($BaseAxios);
    // const response2 = await $baseAxios.get("/api/users");
    // console.log(response2.data);
    message.value = response.data;
  } catch (error) {
    console.error("發生錯誤:", error);
    message.value = "連線失敗";
  }
};

const currentUser = ref(JSON.parse(localStorage.getItem("user")) || null); // 避免現行程式掛點
watch(currentUser, newVal => {
  if (newVal) localStorage.setItem("user", JSON.stringify(newVal));
  else localStorage.removeItem("user");
});
const userDisplayLabel = computed(() =>
  currentUser.value
    ? currentUser.value.type === "guest"
      ? `訪客 ${currentUser.value.phone.slice(-4)}`
      : currentUser.value.name
    : "登入"
);

// 初始化 Store
const userStore = useUserStore(); // 實際要用的
// --- Navigation State ---
const currentPage = ref("home");
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const navItems = [
  { id: "home", label: "首頁" },
  { id: "intro", label: "介紹" },
  { id: "rules", label: "訂房須知" },
  { id: "location", label: "地理位置" },
  { id: "booking", label: "即刻預定" }
];

// --- Home Slider ---
const activeHomeImage = ref(0);
const homeImages = [
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1600"
];
const currentHomeBg = computed(() => homeImages[activeHomeImage.value]);

// onMounted(() => {
//     setInterval(() => { if (currentPage.value === 'home') activeHomeImage.value = (activeHomeImage.value + 1) % homeImages.length; }, 5000);
//     lucide.createIcons();
// });

onMounted(() => {
  startSlideshow();
  startHomeSlideshow(); // Added: Start home carousel on mount
});

const changePage = p => {
  if (p === "booking") {
    // Check if logged in to determine correct start stage
    if (currentUser.value) {
      bookingStage.value = 1; // Logged in users skip init
      // Prefill data if available
      bookingForm.value.phone = currentUser.value.phone;
      bookingForm.value.name =
        currentUser.value.type === "member" ? currentUser.value.name : "";
    } else {
      bookingStage.value = "init"; // Guests go to init
      tempGuestPhone.value = "";
    }
    // Reset other form fields
    bookingForm.value.email = "";
    bookingForm.value.date = "2025-12-31";
    bookingForm.value.adults = 2;
    bookingForm.value.kids = 0;
    rulesAccepted.value = false;
  }
  currentPage.value = p;
  mobileMenuOpen.value = false;
  userMenuOpen.value = false; // Close user menu on nav
};

// --- Login Logic (整合 Store) ---
const handleUserBtnClick = () => {
  if (!currentUser.value) {
    changePage("login");
  } else {
    userMenuOpen.value = !userMenuOpen.value;
  }
};

const handleLogin = () => {
  if (loginForm.value.phone.length === 10) {
    if (loginMode.value === "member") {
      currentUser.value = {
        name: "陳小明",
        phone: loginForm.value.phone,
        type: "member",
        email: "",
        address: ""
      };
      userStore.loginMember("陳小明", loginForm.value.phone);
    } else {
      currentUser.value = {
        name: "貴賓",
        phone: loginForm.value.phoneLast4,
        type: "guest",
        email: "",
        address: ""
      };
      userStore.loginMember("貴賓", "09xxxx");
    }
    loginError.value = "";
    changePage("booking");
  } else {
    loginError.value = "請輸入有效的電話號碼";
  }
};

const handleLogout = () => {
  if (confirm("確定要登出嗎？")) {
    currentUser.value = null;
    userMenuOpen.value = false;
    changePage("home");
  }
};

const handleOrderLookup = () => {
  if (loginForm.value.orderId && loginForm.value.phoneLast4) {
    userStore.loginGuest("09xxxx" + loginForm.value.phoneLast4);
    alert(`查詢成功！訂單 ${loginForm.value.orderId} 狀態：已確認`);
    changePage("booking");
  } else {
    loginError.value = "資料不正確";
  }
};

const currentHomeSlide = ref(0); // Added: Define currentHomeSlide

let timer1, timer2, homeTimer;
const startSlideshow = () => {
  clearInterval(timer1);
  clearInterval(timer2);
  // Intro Slideshow
  timer1 = setInterval(() => {
    if (currentRoom.value.images.length > 0)
      idx1.value = (idx1.value + 1) % currentRoom.value.images.length;
  }, 4000);
  timer2 = setInterval(() => {
    if (currentRoom.value.images.length > 0)
      idx2.value = (idx2.value + 1) % currentRoom.value.images.length;
  }, 6000);
};
const startHomeSlideshow = () => {
  clearInterval(homeTimer);
  // Home Carousel: 3 seconds
  homeTimer = setInterval(() => {
    currentHomeSlide.value = (currentHomeSlide.value + 1) % homeGallery.length;
  }, 3000);
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

// Swipe Logic for Home Carousel
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
// --- Booking Flow ---
const activeRoomIndex = ref(0);
const homeGallery = [
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800",
  "https://watertailhomestay.github.io/images/illustrations/201/IMG_0063.jpg",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
  "https://watertailhomestay.github.io/images/illustrations/301/IMG_0485.jpg",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"
];
const roomsData = [
  {
    id: "201",
    shortName: "雙人房 (201)",
    name: "溫馨雙人房 (201)",
    specs: "1 張標準雙人床 | 最多入住 3 人",
    desc:
      "適合情侶或摯友，擁有獨立陽台與舒適空間，配備完善設施，讓您在埔里享受寧靜夜晚。",
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
    desc:
      "寬敞舒適的空間配置，適合小家庭或三五好友一同出遊，提供浴缸可放鬆身心。",
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
    desc:
      "極具現代感的設計風格，搭配柔和採光，為您提供絕佳的休憩環境，適合親子同遊。",
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
    desc:
      "在星空下與親朋好友享受烤肉樂趣，提供完善的烤肉架與清洗設備，食材可代訂或自備。",
    amenities: ["烤肉架", "洗手台", "夜間照明", "垃圾桶", "用餐桌椅"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
const currentRoom = computed(() => roomsData[activeRoomIndex.value]);
const idx1 = ref(0),
  idx2 = ref(1);
const introImg1 = computed(() => currentRoom.value.images[idx1.value] || "");
const introImg2 = computed(() => currentRoom.value.images[idx2.value] || "");
watch(activeRoomIndex, () => {
  idx1.value = 0;
  idx2.value = 1 % currentRoom.value.images.length;
});

// Updated Icons for Rules Data
const rulesData = ref([
  {
    title: "匯款資訊",
    icon: "fa-credit-card",
    isOpen: true,
    content: ["訂房後請於二日內預付50%訂金。"]
  },
  {
    title: "注意事項",
    icon: "fa-circle-exclamation",
    isOpen: false,
    content: ["Check-in 15:00-18:00。"]
  },
  {
    title: "改期與退訂",
    icon: "fa-calendar-xmark",
    isOpen: false,
    content: ["14天前退全額。"]
  },
  {
    title: "清潔安全",
    icon: "fa-shield-halved",
    isOpen: false,
    content: ["定期消毒。"]
  }
]);

const loginMode = ref("member");
const loginForm = ref({ phone: "", password: "", orderId: "", phoneLast4: "" });
const loginError = ref("");

const bookingStage = ref("init"),
  bookingForm = ref({
    name: "",
    phone: "",
    email: "",
    date: "2025-12-31",
    adults: 2,
    kids: 0,
    bookingType: "standard",
    remarks: ""
  }),
  tempGuestPhone = ref(""),
  rulesAccepted = ref(false),
  finalData = ref({});

const startGuestBooking = () => {
  if (tempGuestPhone.value.length < 10) return;
  bookingForm.value.phone = tempGuestPhone.value;
  bookingStage.value = 1;
};

// Profile & History Mock Data
const profileForm = reactive({ name: "", phone: "", email: "", address: "" });
watch(
  currentUser,
  newVal => {
    if (newVal) {
      profileForm.name = newVal.name;
      profileForm.phone = newVal.phone;
      profileForm.email = newVal.email || "";
      profileForm.address = newVal.address || "";
    }
  },
  { immediate: true }
);

const saveProfile = () => {
  if (currentUser.value) {
    currentUser.value.email = profileForm.email;
    currentUser.value.address = profileForm.address;
    localStorage.setItem("user", JSON.stringify(currentUser.value));
    alert("個人資料已更新！");
  }
};

const userHistory = ref([
  {
    id: "2023100156",
    roomType: "溫馨雙人房 (201)",
    checkIn: "2023-10-01",
    checkOut: "2023-10-02",
    adults: 2,
    kids: 0,
    remarks: "需加嬰兒床"
  },
  {
    id: "2023081522",
    roomType: "戶外烤肉區",
    checkIn: "2023-08-15",
    checkOut: "2023-08-15",
    adults: 5,
    kids: 2,
    remarks: "代訂烤肉食材"
  }
]);

// Calendar Logic
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const daysInMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
);
const startDayOfWeek = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1).getDay()
);

// Price Calculation Logic
const totalPrice = computed(() => {
  if (!bookingForm.value.date) return 0;
  // Current logic assumes 1 night stay based on single date picker
  const nights = 1;

  if (bookingForm.value.bookingType === "whole") {
    return 20000 * nights;
  } else {
    return (
      (bookingForm.value.adults * 2000 + bookingForm.value.kids * 1000) * nights
    );
  }
});
// Computed property for native date picker min value
const minDateStr = computed(() => {
  const d = new Date();
  return d.toISOString().split("T")[0];
});

const changeMonth = delta => {
  let newMonth = currentMonth.value + delta;
  if (newMonth > 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else if (newMonth < 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value = newMonth;
  }
};
const goToToday = () => {
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
};
const isToday = day =>
  day === today.getDate() &&
  currentMonth.value === today.getMonth() &&
  currentYear.value === today.getFullYear();
const isBeforeToday = day => {
  const date = new Date(currentYear.value, currentMonth.value, day);
  return date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
};
const isSelected = day => {
  if (!bookingForm.value.date) return false;
  const d = new Date(bookingForm.value.date);
  return (
    d.getDate() === day &&
    d.getMonth() === currentMonth.value &&
    d.getFullYear() === currentYear.value
  );
};
const selectDate = day => {
  if (isBeforeToday(day)) return;
  const m = (currentMonth.value + 1).toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  bookingForm.value.date = `${currentYear.value}-${m}-${d}`;
};
const checkoutDate = computed(() => {
  if (!bookingForm.value.date) return "";
  const d = new Date(bookingForm.value.date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
});

const nextBookingStep = () => {
  if (bookingStage.value === 1) bookingStage.value = 2;
  else if (bookingStage.value === 2) bookingStage.value = 3;
};
// New function to allow step jumping
const goToStep = step => {
  // Allow jumping back or to any step for demo purposes as requested
  bookingStage.value = step;
};
const updateCount = (k, v) => {
  if (bookingForm.value[k] + v >= 0) bookingForm.value[k] += v;
};
const finishBooking = () => {
  finalData.value = {
    ...bookingForm.value,
    id: Date.now()
      .toString()
      .slice(-6),
    date: bookingForm.value.date
  };
  bookingStage.value = "finish";
};
const resetBooking = () => {
  bookingStage.value = "init";
};

// 日曆
const range = ref({
  start: dayjs()
    .add(1, "day")
    .format("ddd MMM DD YYYY"),
  end: dayjs()
    .add(5, "day")
    .format("ddd MMM DD YYYY")
});

function moveToday() {
  // 一定要一起設定
  range.value = {
    start: new Date(),
    end: new Date().setHours(24)
  };
}

function moveTodaySSS() {
  selectedDate.value = new Date();
}
</script>

