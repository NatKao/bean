<template>
  <section
    class="max-w-5xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
    >
      <div
        class="p-8 md:p-10 border-b border-gray-100 flex-none text-center bg-white z-10"
      >
        <h2 class="text-3xl font-bold text-dark">消費紀錄</h2>
        <div class="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>
      <div class="p-6 md:p-12 flex-1 bg-gray-50">
        <div class="max-w-4xl mx-auto space-y-4">
          <div
            v-if="userHistory.length === 0"
            class="text-center py-20 text-gray-400"
          >
            <font-awesome-icon
              :icon="['far', 'folder-open']"
              class="text-6xl mb-4"
            />
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
                  >已完成</span
                >
                <span class="text-gray-400 text-xs"
                  >訂單編號: {{ record.id }}</span
                >
              </div>
              <h3 class="text-lg font-bold text-dark mb-1">{{
                record.roomType
              }}</h3>
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
              <p class="text-sm text-gray-600">{{ record.remarks || "無" }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

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
</script>
