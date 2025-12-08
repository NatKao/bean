<template>
  <section
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
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >電話</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'phone']"
                      class="text-gray-400"
                    />
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
                >立即預約</button
              >
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
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >電話</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'phone']"
                      class="text-gray-400"
                    />
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
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >訂房序號</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'hashtag']"
                      class="text-gray-400"
                    />
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
                >查詢</button
              >
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
      <div
        v-if="bookingStage !== 'finish'"
        class="w-full bg-white border-b border-gray-200"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol
            role="list"
            class="flex overflow-hidden rounded-md lg:rounded-none"
          >
            <li class="lg:flex-1 relative overflow-hidden">
              <div class="group">
                <span
                  class="absolute top-auto bottom-0 h-1 w-full"
                  :class="bookingStage >= 1 ? 'bg-indigo-600' : 'bg-gray-200'"
                ></span>
                <span
                  class="lg:pl-9 flex items-start px-6 py-5 text-sm font-medium"
                >
                  <span class="flex-shrink-0">
                    <span
                      class="flex h-10 w-10 items-center justify-center rounded-full border-3"
                      :class="
                        bookingStage >= 1
                          ? 'border-indigo-600'
                          : 'border-gray-300'
                      "
                    >
                      <span
                        :class="
                          bookingStage === 1
                            ? 'text-indigo-600'
                            : bookingStage > 1
                            ? 'text-indigo-600'
                            : 'text-gray-500'
                        "
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
                    :class="[
                      'mt-0.5 ml-4 min-w-0 flex-col',
                      bookingStage > 1 ? 'hidden lg:flex' : 'flex'
                    ]"
                  >
                    <span
                      class="text-sm font-medium"
                      :class="
                        bookingStage === 1 ? 'text-indigo-600' : 'text-gray-500'
                      "
                      >同意書</span
                    >
                    <span
                      class="text-xs lg:text-sm font-medium text-gray-500 hidden sm:block"
                      >請詳細閱讀</span
                    >
                  </span>
                </span>
              </div>
            </li>
            <li
              class="flex-1 relative overflow-hidden cursor-pointer"
              @click="goToStep(2)"
            >
              <div class="group">
                <span
                  class="absolute top-auto bottom-0 h-1 w-full"
                  :class="bookingStage >= 2 ? 'bg-indigo-600' : 'bg-gray-200'"
                ></span>
                <span
                  class="lg:pl-9 flex items-start px-6 py-5 text-sm font-medium"
                >
                  <span class="flex-shrink-0">
                    <span
                      class="flex h-10 w-10 items-center justify-center rounded-full border-3"
                      :class="
                        bookingStage >= 2
                          ? 'border-indigo-600'
                          : 'border-gray-300'
                      "
                    >
                      <span
                        :class="
                          bookingStage === 2
                            ? 'text-indigo-600'
                            : bookingStage > 2
                            ? 'text-indigo-600'
                            : 'text-gray-500'
                        "
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
                    :class="[
                      'mt-0.5 ml-4 min-w-0 flex-col',
                      bookingStage > 2 ? 'hidden lg:flex' : 'flex'
                    ]"
                  >
                    <span
                      class="text-sm font-medium"
                      :class="
                        bookingStage === 2 ? 'text-indigo-600' : 'text-gray-500'
                      "
                      >填寫資訊</span
                    >
                    <span
                      class="text-xs lg:text-sm font-medium text-gray-500 hidden sm:block"
                      >入住資料</span
                    >
                  </span>
                </span>
              </div>
            </li>
            <li
              class="flex-1 relative overflow-hidden cursor-pointer"
              @click="goToStep(3)"
            >
              <div class="group">
                <span
                  class="absolute top-auto bottom-0 h-1 w-full"
                  :class="bookingStage >= 3 ? 'bg-indigo-600' : 'bg-gray-200'"
                ></span>
                <span
                  class="lg:pl-9 flex items-start px-6 py-5 text-sm font-medium"
                >
                  <span class="flex-shrink-0">
                    <span
                      class="flex h-10 w-10 items-center justify-center rounded-full border-3"
                      :class="
                        bookingStage >= 3
                          ? 'border-indigo-600'
                          : 'border-gray-300'
                      "
                    >
                      <span
                        :class="
                          bookingStage === 3
                            ? 'text-indigo-600'
                            : 'text-gray-500'
                        "
                      >
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
                      :class="
                        bookingStage === 3 ? 'text-indigo-600' : 'text-gray-500'
                      "
                      >確認資料</span
                    >
                    <span
                      class="text-xs lg:text-sm font-medium text-gray-500 hidden sm:block"
                      >請再確認一次</span
                    >
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
          <div
            v-if="bookingStage === 1"
            class="max-w-2xl mx-auto space-y-8 animate-fade-in"
          >
            <div class="text-center">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">同意書閱讀</h1>
            </div>
            <div
              class="bg-gray-50 p-6 rounded-md border border-gray-200 space-y-4"
            >
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
              <label for="remember_me" class="ml-2 block text-sm text-gray-700"
                >上敘已閱讀完畢</label
              >
            </div>
            <div class="flex justify-center gap-4">
              <button
                class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
                @click="resetBooking"
                >返回</button
              >
              <button
                :disabled="!rulesAccepted"
                class="inline-flex text-white bg-indigo-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-700 rounded text-lg disabled:bg-gray-300"
                @click="nextBookingStep"
                >同意，並下一個步驟</button
              >
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
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >電話號碼</label
                  >
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'phone']"
                        class="text-gray-400"
                      />
                    </div>
                    <input
                      v-model="bookingForm.phone"
                      readonly
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >姓名</label
                  >
                  <input
                    v-model="bookingForm.name"
                    type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="請輸入真實姓名"
                  />
                </div>
                <div>
                  <div class="flex justify-between">
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >電子信箱</label
                    >
                    <p class="text-xs text-gray-500">非必填</p>
                  </div>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'envelope']"
                        class="text-gray-400"
                      />
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
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >訂房模式</label
                  >
                  <div class="flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      @click="bookingForm.bookingType = 'standard'"
                      :class="[
                        'px-4 py-2 text-sm font-medium border rounded-l-lg flex-1 focus:z-10 focus:ring-2 focus:ring-primary',
                        bookingForm.bookingType === 'standard'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      ]"
                      >一般訂房 (人頭計費)</button
                    >
                    <button
                      type="button"
                      @click="bookingForm.bookingType = 'whole'"
                      :class="[
                        'px-4 py-2 text-sm font-medium border rounded-r-lg flex-1 focus:z-10 focus:ring-2 focus:ring-primary',
                        bookingForm.bookingType === 'whole'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      ]"
                      >包棟預定 (每日計費)</button
                    >
                  </div>
                </div>

                <!-- Pax Counts -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >入住人數</label
                  >

                  <!-- Standard Mode: Adults & Kids -->
                  <div v-if="bookingForm.bookingType === 'standard'">
                    <div
                      class="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <div class="flex items-center gap-2">
                        <font-awesome-icon
                          :icon="['fas', 'user']"
                          class="text-gray-400"
                        />
                        <span class="text-sm text-gray-700"
                          >大人 ($2,000/人)</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          @click="updateCount('adults', -1)"
                          class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                          >-</button
                        >
                        <span class="font-bold w-6 text-center">{{
                          bookingForm.adults
                        }}</span>
                        <button
                          @click="updateCount('adults', 1)"
                          class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                          >+</button
                        >
                      </div>
                    </div>
                    <div
                      class="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 mt-2"
                    >
                      <div class="flex items-center gap-2">
                        <font-awesome-icon
                          :icon="['fas', 'baby']"
                          class="text-gray-400"
                        />
                        <span class="text-sm text-gray-700"
                          >小孩 ($1,000/人)</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          @click="updateCount('kids', -1)"
                          class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                          >-</button
                        >
                        <span class="font-bold w-6 text-center">{{
                          bookingForm.kids
                        }}</span>
                        <button
                          @click="updateCount('kids', 1)"
                          class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                          >+</button
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Whole House Mode: Total People (Just for record) -->
                  <div v-else>
                    <div
                      class="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <div class="flex items-center gap-2">
                        <font-awesome-icon
                          :icon="['fas', 'users']"
                          class="text-gray-400"
                        />
                        <span class="text-sm text-gray-700"
                          >總人數 (不影響房價)</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          @click="updateCount('adults', -1)"
                          class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                          >-</button
                        >
                        <span class="font-bold w-6 text-center">{{
                          bookingForm.adults
                        }}</span>
                        <button
                          @click="updateCount('adults', 1)"
                          class="w-6 h-6 bg-white border rounded text-gray-600 hover:bg-gray-100"
                          >+</button
                        >
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 text-right"
                      >* 包棟房價為固定費率 ($20,000/晚)</p
                    >
                  </div>
                </div>

                <!-- Selected Date Display (Updated Responsive) -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >入住日期</label
                    >
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
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >退房日期</label
                    >
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
                  <span class="text-2xl font-bold text-indigo-700"
                    >NT$ {{ totalPrice.toLocaleString() }}</span
                  >
                </div>

                <div class="flex gap-4 mt-4">
                  <!-- Back Button -->
                  <button
                    @click="bookingStage = 1"
                    class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >上一步</button
                  >

                  <!-- Next Button -->
                  <button
                    @click="nextBookingStep"
                    :disabled="
                      !bookingForm.name ||
                      !bookingForm.date ||
                      (bookingForm.bookingType === 'standard' &&
                        bookingForm.adults === 0)
                    "
                    class="flex-[2] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
                    >填寫完畢，並下一個步驟</button
                  >
                </div>
              </div>
            </div>

            <!-- Right: Calendar (Custom Implementation) - Hidden on Mobile -->
            <div
              class="hidden lg:block bg-gray-100 p-6 shadow-lg rounded-lg h-fit"
            >
              <div class="mb-4 text-center">
                <h2 class="text-xl font-semibold text-gray-800"
                  >入住日期選擇</h2
                >
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
                        >今日</button
                      >
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
                <font-awesome-icon
                  :icon="['fas', 'mobile-screen']"
                  class="text-gray-400 mr-2"
                />
                <span class="w-20 text-sm font-medium text-gray-700"
                  >電話號碼</span
                >
                <span>{{ bookingForm.phone }}</span>
              </div>
              <div class="flex items-center">
                <font-awesome-icon
                  :icon="['fas', 'user']"
                  class="text-gray-400 mr-2"
                />
                <span class="w-20 text-sm font-medium text-gray-700">姓名</span>
                <span>{{ bookingForm.name }}</span>
              </div>
              <div class="flex items-center">
                <font-awesome-icon
                  :icon="['fas', 'envelope']"
                  class="text-gray-400 mr-2"
                />
                <span class="w-20 text-sm font-medium text-gray-700"
                  >電子信箱</span
                >
                <span>{{ bookingForm.email || "未填寫" }}</span>
              </div>
              <div class="border-t border-gray-100 my-4 pt-4">
                <div class="flex items-center mb-2">
                  <font-awesome-icon
                    :icon="['fas', 'hotel']"
                    class="text-gray-400 mr-2"
                  />
                  <span class="w-20 text-sm font-medium text-gray-700"
                    >訂房模式</span
                  >
                  <span>{{
                    bookingForm.bookingType === "standard"
                      ? "一般訂房"
                      : "包棟預定"
                  }}</span>
                </div>
                <div class="flex items-center mb-2">
                  <font-awesome-icon
                    :icon="['fas', 'users']"
                    class="text-gray-400 mr-2"
                  />
                  <span class="w-20 text-sm font-medium text-gray-700"
                    >入住人數</span
                  >
                  <span
                    >{{ bookingForm.adults }} 大 {{ bookingForm.kids }} 小</span
                  >
                </div>
                <div class="flex items-center mb-2">
                  <font-awesome-icon
                    :icon="['fas', 'calendar-days']"
                    class="text-gray-400 mr-2"
                  />
                  <span class="w-20 text-sm font-medium text-gray-700"
                    >入住日期</span
                  >
                  <span class="font-bold text-primary">{{
                    bookingForm.date
                  }}</span>
                </div>
                <div class="flex items-center mb-2">
                  <font-awesome-icon
                    :icon="['fas', 'calendar-days']"
                    class="text-gray-400 mr-2"
                  />
                  <span class="w-20 text-sm font-medium text-gray-700"
                    >退房日期</span
                  >
                  <span>{{ checkoutDate }}</span>
                </div>
                <div class="flex items-center">
                  <font-awesome-icon
                    :icon="['fas', 'money-bill-wave']"
                    class="text-gray-400 mr-2"
                  />
                  <span class="w-20 text-sm font-medium text-gray-700"
                    >總金額</span
                  >
                  <span class="font-bold text-indigo-600"
                    >NT$ {{ totalPrice.toLocaleString() }}</span
                  >
                </div>
              </div>
              <!-- Note Section (Textarea) -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >訂單備註</label
                >
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
                  >上一步</button
                >

                <!-- Confirm Button -->
                <button
                  @click="finishBooking"
                  class="flex-[2] py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                  >確定預定</button
                >
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
                  >訪客訂房</div
                >
                <p class="text-sm text-gray-400 mb-2 uppercase tracking-wide"
                  >訂房編號</p
                >
                <p class="font-mono text-3xl font-bold text-primary mb-6">{{
                  finalData.id
                }}</p>

                <div
                  class="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm text-left"
                >
                  <div class="flex items-start gap-3">
                    <font-awesome-icon
                      :icon="['fas', 'circle-info']"
                      class="mt-1"
                    />
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
              <p class="text-gray-500 mb-8"
                >感謝您的預訂，{{ currentUser.name }}</p
              >
              <div
                class="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center w-full mb-6 relative overflow-hidden"
              >
                <div
                  class="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg"
                  >會員訂房</div
                >
                <p class="text-sm text-gray-400 mb-2 uppercase tracking-wide"
                  >訂房編號</p
                >
                <p class="font-mono text-3xl font-bold text-primary mb-6">{{
                  finalData.id
                }}</p>

                <div
                  class="bg-green-50 text-green-700 p-4 rounded-lg text-sm text-left"
                >
                  <div class="flex items-start gap-3">
                    <font-awesome-icon
                      :icon="['fas', 'circle-check']"
                      class="mt-1"
                    />
                    <div>
                      <p class="font-bold mb-1">已歸戶</p>
                      <p>
                        此訂單已儲存至您的帳號，您可隨時至
                        <strong>
                          <a
                            href="#"
                            @click.prevent="router.push('/history')"
                            class="underline"
                            >消費紀錄</a
                          >
                        </strong>
                        查詢。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <button
              @click="
                router.push('/home');
                bookingStage = 'init';
              "
              class="w-full mt-2 py-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
              >回首頁</button
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/OcAuth.js";
import { storeToRefs } from "pinia";  // 引入 storeToRefs解構

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

const userStore = useUserStore(); // 實際要用的
const router = useRouter();

const { currentUser } = storeToRefs(userStore);

const loginForm = ref({ phone: "", password: "", orderId: "", phoneLast4: "" });
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

onMounted(() => {
  if (userStore.isLoggedIn) {
    bookingStage.value = 1;
    bookingForm.value.phone = currentUser.value.phone;
    bookingForm.value.name = currentUser.value.name;
  }
});

const startGuestBooking = () => {
  if (tempGuestPhone.value.length < 10) return;
  bookingForm.value.phone = tempGuestPhone.value;
  bookingStage.value = 1;
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

const finishBooking = () => {
  finalData.value = {
    ...bookingForm.value,
    id: Date.now().toString().slice(-6),
    date: bookingForm.value.date
  };
  bookingStage.value = "finish";
};
const resetBooking = () => {
  bookingStage.value = "init";
  if (userStore.isLoggedIn) {
    bookingStage.value = 1;
    bookingForm.value.phone = currentUser.value.phone;
    bookingForm.value.name = currentUser.value.name;
  }
};

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

// 日曆
const range = ref({
  start: dayjs().add(1, "day").format("ddd MMM DD YYYY"),
  end: dayjs().add(5, "day").format("ddd MMM DD YYYY")
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
