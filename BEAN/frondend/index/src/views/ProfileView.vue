<!-- 
  File Name: LocationView.vue
  Author: huanyao
  Created Date: 2025-12-21
  Description: 
    此元件用於顯示地理交通位置。
  Reviewed Date: 2026-01-？？ huanyao
-->
<template>
  <section
    class="max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-6rem)] xl:max-w-6xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Top Navigation Tabs (Centered) -->
      <div v-show="tabs.length > 1" class="bg-white shadow-sm z-10" >
        <div class="max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-6rem)] xl:max-w-7xl xl:mx-auto px-4">
          <div class="flex justify-center space-x-8 h-16 items-center">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2',
                currentTab === tab.id
                  ? 'bg-primary text-white shadow-md transform scale-105'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-primary'
              ]"
            >
              <font-awesome-icon :icon="tab.icon" />
              {{ tab.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-grow max-w-[calc(100vw-1rem)] md:max-w-7xl xl:mx-auto w-full">
        <!-- TAB 1: 查詢訂單 -->
        <div v-if="currentTab === 'query'" class="space-y-6">
          <!-- Search & Actions Bar -->
          <div
            class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <!-- Left: Search Inputs -->
            <div
              class="flex flex-col xl:flex-row gap-3 w-full md:w-auto items-center overflow-x-auto md:overflow-visible"
            >
              <div
                class="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 flex-shrink-0"
              >
                <span class="text-gray-400 text-sm mr-2 whitespace-nowrap"
                  >日期範圍</span
                >
                <input
                  id="startDate"
                  type="date"
                  v-model="searchFilters.startDate"
                  class="bg-transparent text-sm outline-none xl:w-32 text-gray-600"
                />
                <!-- <InputDate
                  :modelValue="searchFilters.startDate"
                  :isAlwaysShow="true"
                  @update:modelValue="setInDate"
                /> -->
                <span class="mx-2 text-gray-400">~</span>
                <input
                  id="endDate"
                  type="date"
                  v-model="searchFilters.endDate"
                  class="bg-transparent text-sm outline-none xl:w-32 text-gray-600"
                />
              </div>
              <div class="relative w-full md:w-auto min-w-[200px]">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <font-awesome-icon
                    :icon="['fas', 'magnifying-glass']"
                    class="text-gray-400"
                  />
                </div>
                <input
                  id="keyword"
                  v-model="searchFilters.keyword"
                  type="text"
                  placeholder="可查詢LineID/姓名(模糊查詢)"
                  class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <!-- Checkboxes (Fixed: Side by side, no wrap) -->
              <div class="flex items-center gap-4 px-2 flex-shrink-0">
                <label
                  class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors select-none"
                >
                  <input
                    id="cancelled"
                    type="checkbox"
                    v-model="searchFilters.isCancelled"
                    class="h-4 w-4 text-red-500 focus:ring-red-400 border-gray-300 rounded cursor-pointer"
                  />
                  <span class="ml-2 text-sm text-gray-600 whitespace-nowrap"
                    >退訂</span
                  >
                </label>
                <label
                  class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors select-none"
                >
                  <input
                    id="blockList"
                    type="checkbox"
                    v-model="searchFilters.isBlacklist"
                    class="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span class="ml-2 text-sm text-gray-600 whitespace-nowrap"
                    >黑名單</span
                  >
                </label>
              </div>

              <div class="flex items-center gap-4 px-2 flex-shrink-0">
                <button
                  @click="handleSearch"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm whitespace-nowrap flex-shrink-0"
                >
                  查詢
                </button>

                <!-- Right: Add Button -->
                <button
                  @click="openAddModal"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" /> 新增訂單
                </button>
              </div>
            </div>
          </div>

          <!-- Orders List (Text-Only Horizontal Cards) -->
          <div class="space-y-4">
            <!-- Empty State -->
            <div
              v-if="orders.length === 0"
              class="py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300 text-3xl"
            >
              <font-awesome-icon
                :icon="['fas', 'magnifying-glass']"
                class="block mx-auto opacity-20"
              />
              查無資料
            </div>

            <!-- Card Item -->
            <div
              v-for="order in orders"
              :key="order.bill_no"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row gap-6 items-start hover:shadow-md transition-shadow group"
            >
              <!-- Content Group -->
              <div class="flex-grow flex flex-col gap-4 w-full">
                <!-- Information Grid -->
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                >
                  <!-- 1. ID & Status -->
                  <div class="min-w-[140px]">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="text-xs text-gray-400 uppercase tracking-wider"
                        >訂單編號</span
                      >
                      <span
                        :class="getStatusClass(order.status)"
                        class="px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        {{ getStstusText(order.status) }}
                      </span>
                    </div>
                    <div class="flex justify-between md:block">
                      <p class="text-lg font-bold text-gray-800 font-mono">{{
                        order.bill_no
                      }}</p>
                      <button
                        v-show="order.history.length > 0"
                        @click="handleHistory(order.history)"
                        class="lg:flex-none px-2 py-1 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm bg-white"
                      >
                        <font-awesome-icon :icon="['fas', 'book']" />歷史訂單({{
                          order.history.length
                        }})
                      </button>
                    </div>
                  </div>
                  <!-- 2. Guest Info -->
                  <div class="min-w-[160px]">
                    <p class="text-xs text-gray-400 mb-1"> 訂房人資訊 </p>
                    <h3 class="font-bold text-gray-900 text-base">
                      <span v-if="order.is_block && order.is_block === 'Y'">
                        <font-awesome-icon :icon="['fas', 'user-slash']" />
                      </span>
                      {{ order.name }}</h3
                    >
                    <div class="flex text-sm text-gray-500 gap-2 md:block md:flex-col ">
                      <span
                        v-if="order.line_id"
                        class="flex items-center text-green-600 mt-0.5"
                        ><font-awesome-icon
                          :icon="['fab', 'line']"
                          class="w-3 h-3 mr-1.5"
                        />
                        {{ order.line_id }}</span
                      >
                      <span class="flex items-center"
                        ><font-awesome-icon
                          :icon="['fas', 'phone']"
                          class="w-3 h-3 mr-1.5 text-gray-400"
                        />
                        {{ "0" + order.tel }}</span
                      >
                    </div>
                  </div>

                  <!-- 3. Date Info -->
                  <div class="min-w-[180px]">
                    <p class="text-xs text-gray-400 mb-1">入住 / 退房</p>
                    <div class="text-sm flex gap-2 md:block md:space-y-1">
                      <p class="flex items-center font-medium text-gray-700">
                        <font-awesome-icon
                          :icon="['fas', 'calendar-days']"
                          class="w-3 h-3 mr-1.5 text-indigo-500"
                        />
                        {{ dayjs(order.checkin_date).format("YYYY/MM/DD") }}
                      </p>
                      <p class="flex items-center text-gray-500">
                        <font-awesome-icon
                          :icon="['fas', 'calendar-days']"
                          class="w-3 h-3 mr-1.5 text-gray-300"
                        />
                        {{ dayjs(order.checkout_date).format("YYYY/MM/DD") }}
                      </p>
                    </div>
                  </div>

                  <!-- 4. Room Info -->
                  <div>
                    <p class="text-xs text-gray-400 mb-1">房型與人數</p>
                    <div class="text-sm text-sm flex gap-2 md:block">
                      <div class="flex items-center md:mb-1">
                        <span
                          v-if="order.is_charter"
                          class="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[14px] font-bold rounded"
                          >包場</span
                        >
                        <template v-else>
                          <font-awesome-icon
                            :icon="['fas', 'bed']"
                            class="w-3 h-3 mr-1.5 text-gray-400"
                          />
                          <span class="font-bold md:mr-1">{{
                            order.house_count
                          }}</span>
                          房
                        </template>
                      </div>
                      <div class="flex items-center text-gray-500">
                        <font-awesome-icon
                          :icon="['fas', 'users']"
                          class="w-3 h-3 mr-1.5 text-gray-400"
                        />
                        <span>{{ order.adults }} 大 {{ order.kids }} 小</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Remarks (New Section) -->
                <div
                  v-show="order.remark"
                  class="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start text-sm text-gray-600 mt-auto"
                >
                  <div
                    class="font-bold text-gray-500 mr-2 flex-shrink-0 flex items-center gap-1"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'circle-info']"
                      class="text-xs"
                    />
                    備註:
                  </div>
                  <span>{{ order.remark }}</span>
                </div>
                <div
                  v-show="order.refund_remark"
                  class="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col text-sm text-gray-600 mt-auto"
                >
                  <div class="flex items-center flex-wrap gap-y-1">
                    <div class="flex items-center mr-4">
                      <div class="font-bold text-gray-500 mr-2 flex-shrink-0 flex items-center gap-1">
                        <font-awesome-icon :icon="['fas', 'circle-info']" class="text-xs" />
                        退訂日期:
                      </div>
                      <span>{{ dayjs(order.refund_date).format("YYYY/MM/DD") }}</span>
                    </div>

                    <div class="flex items-center">
                      <div class="font-bold text-gray-500 mr-2 flex-shrink-0 flex items-center gap-1">
                        退訂金額:
                      </div>
                      <span>{{ order.refund_amount }}</span>
                    </div>
                  </div>

                  <div class="flex items-start mt-2">
                    <div class="font-bold text-gray-500 mr-2 flex-shrink-0 flex items-center gap-1">
                      退訂留言:
                    </div>
                    <span class="break-all whitespace-pre-wrap">{{ order.refund_remark }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions (Right side on desktop) -->
              <div
                class="flex lg:flex-col gap-2 w-full lg:w-auto border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0 mt-2 lg:mt-0 flex-shrink-0"
              >
                <button
                  v-show="order.status !== 'F' && order.status !== 'D'"
                  @click="handleFinish(order)"
                  class="flex-1 lg:flex-none px-4 py-2 text-green-500 border border-green-200 rounded-lg hover:bg-green-50 text-xs font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm bg-white"
                >
                  <font-awesome-icon :icon="['far', 'square-check']" /> 完成訂單
                </button>
                <button
                  v-show="order.status !== 'F' && order.status !== 'D'"
                  @click="openCancelModal(order)"
                  class="flex-1 lg:flex-none px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 text-xs font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm bg-white"
                >
                  <font-awesome-icon :icon="['fas', 'ban']" /> 退訂
                </button>
                <button
                  v-show="order.is_block !== 'Y'"
                  @click="handleBlacklist(order)"
                  class="flex-1 lg:flex-none px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm bg-white"
                >
                  <font-awesome-icon :icon="['fas', 'user-slash']" /> 黑名單
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: 輸出 Excel -->
        <div
          v-if="currentTab === 'export'"
          class="flex justify-center items-start pt-10"
        >
          <div
            class="bg-white p-8 mr-2 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md"
          >
            <div class="text-center mb-6">
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl"
              >
                <font-awesome-icon :icon="['fas', 'file-excel']" />
              </div>
              <h2 class="text-2xl font-bold text-gray-800">匯出訂單報表</h2>
              <p class="text-gray-500 text-sm mt-2">請選擇欲匯出的日期區間</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >開始日期</label
                >
                <input
                  type="date"
                  v-model="exportForm.startDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >結束日期</label
                >
                <input
                  type="date"
                  v-model="exportForm.endDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <button
                @click="handleExport(1)"
                class="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-transform hover:scale-[1.02] shadow-md mt-4 flex justify-center items-center gap-2"
              >
                <font-awesome-icon :icon="['fas', 'download']" /> 匯出 Excel
              </button>
            </div>
          </div>
          <div
            class="bg-white p-8  rounded-2xl shadow-lg border border-gray-100 w-full max-w-md"
          >
            <div class="text-center mb-6">
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl"
              >
                <font-awesome-icon :icon="['fas', 'file-excel']" />
              </div>
              <h2 class="text-2xl font-bold text-gray-800">匯出Log</h2>
              <p class="text-gray-500 text-sm mt-2">請選擇欲匯出的日期區間</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >開始日期</label
                >
                <input
                  type="date"
                  v-model="exportForm.startDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >結束日期</label
                >
                <input
                  type="date"
                  v-model="exportForm.endDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <button
                @click="handleExport(2)"
                class="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-transform hover:scale-[1.02] shadow-md mt-4 flex justify-center items-center gap-2"
              >
                <font-awesome-icon :icon="['fas', 'download']" /> 匯出 Excel
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- -->

      <div
        v-if="showHistoryModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- Background overlay -->
          <div
            class="fixed inset-0 bg-gray-500/60 transition-opacity"
            @click="showHistoryModal = false"
          ></div>

          <!-- Modal panel -->
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full relative z-50"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3
                class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
              >
                <font-awesome-icon
                  :icon="['fas', 'book']"
                  class="text-gray-600"
                />
                歷史訂單
              </h3>
              <div
                v-for="history in historyForm"
                :key="history.bill_no"
                class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row gap-6 items-start hover:shadow-md transition-shadow group"
              >
                <!-- Content Group -->
                <div class="flex-grow flex flex-col gap-4 w-full">
                  <!-- Information Grid -->
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                  >
                    <!-- 1. ID & Status -->
                    <div class="min-w-[140px]">
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="text-xs text-gray-400 uppercase tracking-wider"
                          >訂單編號</span
                        >
                        <span
                          :class="getStatusClass(history.status)"
                          class="px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          {{ getStstusText(history.status) }}
                        </span>
                      </div>
                      <p class="text-lg font-bold text-gray-800 font-mono">{{
                        history.bill_no
                      }}</p>
                    </div>
                    <!-- 2. Guest Info -->
                    <div class="min-w-[160px]">
                      <p class="text-xs text-gray-400 mb-1"> 訂房人資訊 </p>
                      <h3 class="font-bold text-gray-900 text-base">
                        <span v-if="history.is_block && history.is_block === 'Y'">
                          <font-awesome-icon :icon="['fas', 'user-slash']" />
                        </span>
                        {{ history.name }}</h3
                      >
                      <div class="flex flex-col text-sm text-gray-500">
                        <span
                          v-if="history.line_id"
                          class="flex items-center text-green-600 mt-0.5"
                          ><font-awesome-icon
                            :icon="['fab', 'line']"
                            class="w-3 h-3 mr-1.5"
                          />
                          {{ history.line_id }}</span
                        >
                        <span class="flex items-center"
                          ><font-awesome-icon
                            :icon="['fas', 'phone']"
                            class="w-3 h-3 mr-1.5 text-gray-400"
                          />
                          {{ "0" + history.tel }}</span
                        >
                      </div>
                    </div>

                    <!-- 3. Date Info -->
                    <div class="min-w-[180px]">
                      <p class="text-xs text-gray-400 mb-1">入住 / 退房</p>
                      <div class="space-y-1 text-sm">
                        <p class="flex items-center font-medium text-gray-700">
                          <font-awesome-icon
                            :icon="['fas', 'calendar-days']"
                            class="w-3 h-3 mr-1.5 text-indigo-500"
                          />
                          {{ dayjs(history.checkin_date).format("YYYY/MM/DD") }}
                        </p>
                        <p class="flex items-center text-gray-500">
                          <font-awesome-icon
                            :icon="['fas', 'calendar-days']"
                            class="w-3 h-3 mr-1.5 text-gray-300"
                          />
                          {{ dayjs(history.checkout_date).format("YYYY/MM/DD") }}
                        </p>
                      </div>
                    </div>

                    <!-- 4. Room Info -->
                    <div>
                      <p class="text-xs text-gray-400 mb-1">房型與人數</p>
                      <div class="text-sm text-gray-700">
                        <div class="flex items-center mb-1">
                          <span
                            v-if="history.is_charter"
                            class="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[14px] font-bold rounded"
                            >包場</span
                          >
                          <template v-else>
                            <font-awesome-icon
                              :icon="['fas', 'bed']"
                              class="w-3 h-3 mr-1.5 text-gray-400"
                            />
                            <span class="font-bold mr-1">{{
                              history.house_count
                            }}</span>
                            房
                          </template>
                        </div>
                        <div class="flex items-center text-gray-500">
                          <font-awesome-icon
                            :icon="['fas', 'users']"
                            class="w-3 h-3 mr-1.5 text-gray-400"
                          />
                          <span>{{ history.adults }} 大 {{ history.kids }} 小</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Remarks (New Section) -->
                  <div
                    v-show="history.remark"
                    class="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start text-sm text-gray-600 mt-auto"
                  >
                    <div
                      class="font-bold text-gray-500 mr-2 flex-shrink-0 flex items-center gap-1"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'circle-info']"
                        class="text-xs"
                      />
                      備註:
                    </div>
                    <span>{{ history.remark }}</span>
                  </div>
                  <div
                    v-show="history.refund_remark"
                    class="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start text-sm text-gray-600 mt-auto"
                  >
                    <div
                      class="font-bold text-gray-500 mr-2 flex-shrink-0 flex items-center gap-1"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'circle-info']"
                        class="text-xs"
                      />
                      退訂日期:
                    </div>
                    <span>{{
                      dayjs(history.refund_date).format("YYYY/MM/DD")
                    }}</span>
                    <div
                      class="font-bold text-gray-500 mr-2 ml-2 flex-shrink-0 flex items-center gap-1"
                    >
                      退訂金額:
                    </div>
                    <span>{{ history.refund_amount }}</span>

                    <div
                      class="font-bold text-gray-500 mr-2 ml-2 flex-shrink-0 flex items-center gap-1"
                    >
                      退訂留言:
                    </div>
                    <span>{{ history.refund_remark }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popup: Add Order (新增訂單) -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- Background overlay -->
          <div
            class="fixed inset-0 bg-gray-500/60 transition-opacity"
            @click="showAddModal = false"
          ></div>

          <!-- Modal panel -->
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative z-50"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3
                class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
              >
                <font-awesome-icon
                  :icon="['fas', 'plus-circle']"
                  class="text-indigo-600"
                />
                新增訂單
              </h3>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div :class="{ 'border border-red-500': isErr.line_id }"
                    ><label class="block text-sm font-medium text-gray-700 mb-1"
                      >Line ID</label
                    ><input
                      v-model="addForm.line_id"
                      class="w-full border rounded-md px-3 py-2 text-sm"
                  /></div>
                  <div
                    ><label class="block text-sm font-medium text-gray-700 mb-1"
                      >電話</label
                    ><input
                      v-model="addForm.tel"
                      class="w-full border rounded-md px-3 py-2 text-sm"
                  /></div>
                </div>
                <div
                  ><label class="block text-sm font-medium text-gray-700 mb-1"
                    >姓名</label
                  ><input
                    v-model="addForm.name"
                    class="w-full border rounded-md px-3 py-2 text-sm"
                /></div>
                <div class="grid grid-cols-2 gap-4">
                  <div :class="{ 'border border-red-500': isErr.checkin_date }"
                    ><label class="block text-sm font-medium text-gray-700 mb-1"
                      >入住日期</label
                    >
                    <InputDate
                      :modelValue="addForm.checkin_date"
                      :isAlwaysShow="true"
                      @update:modelValue="setInDate"
                    />
                  </div>
                  <div :class="{ 'border border-red-500': isErr.checkout_date }"
                    ><label class="block text-sm font-medium text-gray-700 mb-1"
                      >退房日期</label
                    >
                    <InputDate
                      :modelValue="addForm.checkout_date"
                      :isAlwaysShow="true"
                      @update:modelValue="setOutDate"
                    />
                  </div>
                </div>

                <!-- Styled Booking Options Block (包棟 & 房數) -->
                <div
                  class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4"
                  :class="{ 'border border-red-500': isErr.isCntErr }"
                >
                  <!-- Header -->
                  <div
                    class="flex items-center gap-2 text-indigo-700 font-bold border-b border-gray-200 pb-2 mb-2 text-sm"
                  >
                    <font-awesome-icon :icon="['fas', 'bed']" /> 住宿需求
                  </div>

                  <!-- Whole House Toggle -->
                  <label
                    class="flex items-center p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-indigo-500 transition-colors shadow-sm select-none"
                  >
                    <input
                      type="checkbox"
                      v-model="addForm.is_charter"
                      class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div class="ml-3">
                      <span class="block text-sm font-bold text-gray-800"
                        >包棟預定</span
                      >
                      <span class="block text-xs text-gray-500">全館包場</span>
                    </div>
                  </label>

                  <!-- Room Counts Grid -->
                  <div
                    class="grid grid-cols-3 gap-3"
                    :class="{
                      'opacity-40 pointer-events-none grayscale':
                        addForm.is_charter
                    }"
                  >
                    <!-- Room 2 -->
                    <div
                      class="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2"
                    >
                      <span class="text-xs text-gray-500 font-medium"
                        >兩人房</span
                      >
                      <div class="flex items-center gap-2">
                        <button
                          @click="addForm.room2_cnt > 0 && addForm.room2_cnt--"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95"
                          type="button"
                          :disabled="addForm.is_charter"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'minus']"
                            class="text-[10px]"
                          />
                        </button>
                        <span class="w-4 text-center font-bold text-gray-800">{{
                          addForm.room2_cnt
                        }}</span>
                        <button
                          @click="addForm.room2_cnt++"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95"
                          type="button"
                          :disabled="addForm.is_charter"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'plus']"
                            class="text-[10px]"
                          />
                        </button>
                      </div>
                    </div>

                    <!-- Room 4 -->
                    <div
                      class="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2"
                    >
                      <span class="text-xs text-gray-500 font-medium"
                        >四人房</span
                      >
                      <div class="flex items-center gap-2">
                        <button
                          @click="addForm.room4_cnt > 0 && addForm.room4_cnt--"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95"
                          type="button"
                          :disabled="addForm.is_charter"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'minus']"
                            class="text-[10px]"
                          />
                        </button>
                        <span class="w-4 text-center font-bold text-gray-800">{{
                          addForm.room4_cnt
                        }}</span>
                        <button
                          @click="addForm.room4_cnt++"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95"
                          type="button"
                          :disabled="addForm.is_charter"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'plus']"
                            class="text-[10px]"
                          />
                        </button>
                      </div>
                    </div>

                    <!-- Room 6 -->
                    <div
                      class="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2"
                    >
                      <span class="text-xs text-gray-500 font-medium"
                        >六人房</span
                      >
                      <div class="flex items-center gap-2">
                        <button
                          @click="addForm.room6_cnt > 0 && addForm.room6_cnt--"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95"
                          type="button"
                          :disabled="addForm.is_charter"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'minus']"
                            class="text-[10px]"
                          />
                        </button>
                        <span class="w-4 text-center font-bold text-gray-800">{{
                          addForm.room6_cnt
                        }}</span>
                        <button
                          @click="addForm.room6_cnt++"
                          class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95"
                          type="button"
                          :disabled="addForm.is_charter"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'plus']"
                            class="text-[10px]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div
                    ><label class="block text-sm font-medium text-gray-700 mb-1"
                      >大人</label
                    ><input
                      type="number"
                      v-model="addForm.adults"
                      class="w-full border rounded-md px-3 py-2 text-sm"
                  /></div>
                  <div
                    ><label class="block text-sm font-medium text-gray-700 mb-1"
                      >小孩</label
                    ><input
                      type="number"
                      v-model="addForm.kids"
                      class="w-full border rounded-md px-3 py-2 text-sm"
                  /></div>
                </div>

                <div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >備註</label
                    >
                    <textarea
                      v-model="addForm.remark"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button
                @click="submitAddOrder"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                >建立訂單</button
              >
              <button
                @click="showAddModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >取消</button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Popup: Cancel Order (退訂) -->
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500/60 transition-opacity"
            @click="showCancelModal = false"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative z-50"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3
                class="text-xl font-bold text-red-600 mb-1 flex items-center gap-2"
              >
                <font-awesome-icon :icon="['fas', 'calendar-xmark']" /> 執行退訂
              </h3>
              <p class="text-sm text-gray-500 mb-6">
                訂單編號: {{ selectedOrder.bill_no }} -
                {{ selectedOrder.name }}
              </p>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1"
                    >入住日期 (不可修改)</label
                  >
                  <input
                    type="text"
                    :value="
                      dayjs(selectedOrder.checkin_date).format('YYYY/MM/DD')
                    "
                    readonly
                    class="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >退訂日期</label
                    >
                    <InputDate
                      :modelValue="cancelForm.refund_date"
                      :isAlwaysShow="true"
                      @update:modelValue="setCancelDate"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >已付金額</label
                    >
                    <input
                      type="number"
                      v-model="cancelForm.price"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      style="padding-top: 9px; padding-bottom: 9px"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >退訂理由</label
                  >
                  <textarea
                    v-model="cancelForm.refund_remark"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                    placeholder="例如：行程變更、天災..."
                  ></textarea>
                </div>

                <div class="pt-2">
                  <button
                    @click="calculateRefund"
                    class="w-full py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <font-awesome-icon :icon="['fas', 'calculator']" />
                    執行退訂計算
                  </button>
                </div>

                <div
                  v-if="cancelForm.calculated"
                  class="bg-red-50 p-4 rounded-lg border border-red-100 mt-2 animate-fade-in"
                >
                  <label class="block text-sm font-bold text-red-700 mb-1"
                    >應退金額 (可修改)</label
                  >
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500 mr-1"
                      >NT$</span
                    >
                    <input
                      type="number"
                      v-model="cancelForm.refund_amount"
                      class="w-full pl-10 pr-3 py-2 border border-red-300 rounded-md text-red-700 font-bold focus:ring-red-500 focus:border-red-500"
                      style="padding-left: 3rem"
                    />
                  </div>
                  <p class="text-xs text-red-500 mt-1"
                    >* 系統已依比例
                    {{ "(" + cancelForm.refund_rate * 100 + "%)" }}
                    計算
                  </p>
                  <p v-show="showDateEmptyText" class="text-xs text-red-500 mt-1">
                    * 退訂日期未填寫，已由系統給予預設值(今日)
                  </p>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button
                @click="confirmCancel"
                :disabled="!cancelForm.calculated"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                >確認退訂</button
              >
              <button
                @click="showCancelModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >取消</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, inject, computed } from "vue";
import InputDate from "@/components/component/InputDate.vue";
import dayjs from "dayjs";

const GAS_URL = import.meta.env.VITE_GAS_URL;
const $msg = inject("$msg");

// --- State ---
const currentTab = ref("query");
const tabs = [
  { id: "query", name: "查詢訂單", icon: ["fas", "magnifying-glass"] },
  //{ id: "export", name: "輸出 Excel", icon: ["fas", "file-excel"] }
];

const getStstusText = status => {
  if (status === "F") return "已完成";
  if (status === "D") return "已退訂";
  return "已確認";
};
// --- Mock Data ---
const orders = ref([]);

// --- Query Logic ---
const searchFilters = reactive({
  startDate: "",
  endDate: "",
  keyword: "",
  isBlacklist: false,
  isCancelled: false
});
const handleSearch = async () => {
  try {
    // 關鍵技巧：用 text/plain 騙過瀏覽器的 CORS 預檢
    $msg.showLoading();
    const params = new URLSearchParams({
      action: "filter",
      ...searchFilters
    });
    const urlWithParams = `${GAS_URL}?${params.toString()}`;
    const response = await fetch(urlWithParams, {
      method: "GET",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" }
    });
    const res = await response.json();
    $msg.hideLoading();
    if (res.status === "success") {
      $msg.notify.success("查詢成功！");
      orders.value = res.data;
      showAddModal.value = false;
      return;
    }
    $msg.notify.error("查詢失敗", res.msg);
  } catch (err) {
    console.error(err);
    $msg.notify.error("讀取失敗", "無法連線到DB");
  }
};

const getStatusClass = status => {
  if (status === "F") return "bg-blue-100 text-blue-800";
  if (status === "D") return "bg-gray-100 text-gray-800";
  return "bg-green-100 text-green-800";
};

const showHistoryModal = ref(false);
const historyForm = ref([]);
const handleHistory = historyAry => {
  showHistoryModal.value = true;
  historyForm.value = historyAry;
};

// --- Add Order Logic ---
const showAddModal = ref(false);
const addForm = reactive({
  bill_no: "",
  name: "",
  tel: "",
  line_id: "",
  checkin_date: "",
  checkout_date: "",
  is_charter: false,
  // Split room counts
  room2_cnt: 0,
  room4_cnt: 0,
  room6_cnt: 0,
  adults: 0,
  kids: 0,
  status: "",
  remark: ""
});

const isErr = ref({ isCntErr: false });
const openAddModal = () => {
  Object.assign(addForm, {
    bill_no: "",
    name: "",
    tel: "",
    line_id: "",
    checkin_date: "",
    checkout_date: "",
    is_charter: false,
    room2_cnt: 0,
    room4_cnt: 0,
    room6_cnt: 0,
    adults: 0,
    kids: 0,
    status: "",
    remark: ""
  });
  showAddModal.value = true;
};

const setInDate = date => {
  addForm.checkin_date = date;
};

const setOutDate = date => {
  addForm.checkout_date = date;
};

const setCancelDate = date => {
  cancelForm.refund_date = date;
};

const submitAddOrder = async () => {
  const house_count = addForm.room2_cnt + addForm.room4_cnt + addForm.room6_cnt;

  try {
    // 關鍵技巧：用 text/plain 騙過瀏覽器的 CORS 預檢
    $msg.showLoading();
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "create",
        ...addForm,
        house_count: house_count
      }) // 把物件轉成字串傳送
    });
    const res = await response.json();
    $msg.hideLoading();
    if (res.status === "success") {
      $msg.notify.success("訂單建立成功！");
      showAddModal.value = false;
      // 這裡可以再呼叫一次讀取 API 來更新列表
      handleSearch();
      return;
    }
    $msg.notify.error("寫入失敗", res.msg);
  } catch (err) {
    console.error(err);
    $msg.hideLoading();
    $msg.notify.error("讀取失敗", "無法連線到DB");
  }
};

// --- Cancel Logic ---
const showCancelModal = ref(false);
const selectedOrder = ref(null);
const cancelForm = reactive({
  bill_no: "",
  refund_date: "",
  calculated: false,
  refund_amount: 0,
  refund_rate: 0,
  status: "",
  refund_remark: ""
});

const openCancelModal = order => {
  selectedOrder.value = order;
  cancelForm.bill_no = selectedOrder.value.bill_no;
  // price,	refund_rate,	refund_amount,	refund_date,	21.refund_remark
  // 金額, 退訂％數, 退訂金額, 退訂日期, 退訂理由
  cancelForm.price = "";
  cancelForm.refund_rate = 0.0;
  cancelForm.refund_amount = 0;
  cancelForm.refund_date = "";
  cancelForm.refund_remark = "";
  cancelForm.calculated = false;
  cancelForm.status = "D";
  showDateEmptyText.value = false;
  showCancelModal.value = true;
};

const showDateEmptyText = ref(false);
const calculateRefund = () => {
  if (!cancelForm.price) {
    $msg.alert.error("請輸入已付金額！！！");
    return;
  }
  let text = "";
  if (!cancelForm.refund_date) {
    setCancelDate(dayjs().toDate());
    showDateEmptyText.value = true;
  }
  const date1 = dayjs(selectedOrder.value.checkin_date);
  const days = date1.diff(cancelForm.refund_date, "day", true);
  /*
旅客住宿日當日取消訂房扣預付訂金金額 100%
旅客於住宿日前 1 日內取消訂房扣房價預付訂金金額 80%
旅客於住宿日前 2-3 日內取消訂房扣房價預付訂金金額 70%
旅客於住宿日前 4-6 日內取消訂房扣房價預付訂金金額 60%
旅客於住宿日前 7-9 日內取消訂房扣房價預付訂金金額 50%
旅客於住宿日前 10-13 日內取消訂房扣房價預付訂金金額 30%
  */
  let rate = 0.0;
  if (days >= 14) {
    rate = 1;
  } else if (days <= 13 && days >= 10) {
    rate = 0.8;
  } else if (days <= 9 && days >= 7) {
    rate = 0.7;
  } else if (days <= 6 && days >= 4) {
    rate = 0.6;
  } else if (days <= 3 && days >= 2) {
    rate = 0.5;
  } else if (days == 1) {
    rate = 0.3;
  } else {
    rate = 0;
  }
  cancelForm.refund_rate = rate;
  cancelForm.refund_amount = Math.floor(cancelForm.price * rate);
  cancelForm.calculated = true;
};

const confirmCancel = async () => {
  const isOk = await $msg.confirm("確定執行退訂作業嗎？");
  if (!isOk) {
    return;
  }
  try {
    $msg.showLoading();
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "updateFund",
        ...cancelForm
      }) // 把物件轉成字串傳送
    });
    const res = await response.json();
    $msg.hideLoading();
    if (res.status === "success") {
      showCancelModal.value = false;
      let text = `訂單 ${selectedOrder.value.bill_no} 已退訂，需付退款金額: ${cancelForm.refund_amount}`;
      if (cancelForm.refund_amount === 0) {
        text = `訂單 ${selectedOrder.value.bill_no} 已退訂`;
      }
      $msg.alert.success(text);
      // 這裡可以再呼叫一次讀取 API 來更新列表
      handleSearch();
      return;
    }
    $msg.notify.error("寫入失敗", res.msg);
  } catch (err) {
    console.error(err);
    $msg.notify.error("讀取失敗", "無法連線到DB");
  }
};

const handleFinish = async order => {
  const isOk = await $msg.confirm(
    `要將 ${order.name} (${order.line_id}/0${order.tel}) 完成訂單了嗎？`
  );
  if (!isOk) {
    return;
  }
  try {
    $msg.showLoading();
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "updateFinish",
        ...order
      }) // 把物件轉成字串傳送
    });
    const res = await response.json();
    $msg.hideLoading();
    if (res.status === "success") {
      $msg.alert.success("已完成該筆訂單");
      // 這裡可以再呼叫一次讀取 API 來更新列表
      handleSearch();
      return;
    }
    $msg.notify.error("寫入失敗", res.msg);
  } catch (err) {
    console.error(err);
    $msg.notify.error("讀取失敗", "無法連線到DB");
  }
};

// --- Blacklist Logic ---
const handleBlacklist = async order => {
  const isOk = await $msg.confirm(
    `確定將 ${order.name} (${order.line_id}/0${order.tel}) 加入黑名單嗎？`
  );
  if (!isOk) {
    return;
  }
  try {
    $msg.showLoading();
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "updateBlocker",
        ...order
      }) // 把物件轉成字串傳送
    });
    const res = await response.json();
    $msg.hideLoading();
    if (res.status === "success") {
      $msg.alert.success("已加入黑名單");
      // 這裡可以再呼叫一次讀取 API 來更新列表
      handleSearch();
      return;
    }
    $msg.notify.error("寫入失敗", res.msg);
  } catch (err) {
    console.error(err);
    $msg.notify.error("讀取失敗", "無法連線到DB");
  }
};

// --- Export Logic ---
const exportForm = reactive({ startDate: "", endDate: "" });
const handleExport = async (type) => {
  if (!exportForm.startDate || !exportForm.endDate)
    return alert("請選擇日期範圍");

  let csv = type === 1 ? "\n" : "\n";


  try {
    // 關鍵技巧：用 text/plain 騙過瀏覽器的 CORS 預檢
    $msg.showLoading();
    const params = new URLSearchParams({
      action: "download" + tpye,
      ...searchFilters
    });
    const urlWithParams = `${GAS_URL}?${params.toString()}`;
    const response = await fetch(urlWithParams, {
      method: "GET",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" }
    });
    const res = await response.json();
    $msg.hideLoading();
    if (res.status === "success") {
      $msg.notify.success("查詢資料成功！");
      orders.value = res.data;

      const anchor = document.createElement("a");
      anchor.href = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csv);
      anchor.target = "_blank";
      anchor.download = "" + dayjs.format("YYYY_MM_DD") + ".csv";
      anchor.click();

      anchor.remove();
      return;
    }
    $msg.notify.error("查詢資料失敗", res.msg);
  } catch (err) {
    console.error(err);
    $msg.notify.error("讀取失敗", "無法連線到DB");
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
