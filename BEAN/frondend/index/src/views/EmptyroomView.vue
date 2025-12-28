<template>
  <section
    class="max-w-5xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <!-- Init Stage: Calendar Only (雙月份顯示) -->
      <div
        class="h-full flex items-center justify-center flex-grow bg-gray-50 p-4 md:p-8"
      >
        <!-- Calendar Container -->
        <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl">
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-gray-800">空房查詢</h2>
            <div class="flex justify-center gap-6 mt-3 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 bg-green-500 rounded shadow-sm"></span>
                <span>有空房</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 bg-yellow-400 rounded shadow-sm"></span>
                <span>尚有空房</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 bg-red-500 rounded shadow-sm"></span>
                <span>無空房</span>
              </div>
            </div>
          </div>

          <!-- V-Calendar Component -->
          <DatePicker
            ref="big_calendar"
            mode="date"
            class="border-0"
            expanded
            :attributes="big_attributes"
            :columns="2"
            :step="1"
            :min-date="new Date()"
            :max-date="new Date('2026-12-31')"
            :locale="{
              id: 'zh-TW',
              firstDayOfWeek: 1,
              masks: { weekdays: 'WW' , title: 'YYYY-MM' }
            }"
          >
          </DatePicker>
        </div>
      </div>
  </section>
</template>ａ

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/OcAuth.js";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";

// Mock store for standalone preview
const userStore = { isLoggedIn: true, loginGuest: () => {} };
const currentUser = { value: { name: "張三豐", phone: "0999888777" } };

const bookingStage = ref("init");
const bookingForm = ref({
  name: "張三豐",
  phone: "0999888777",
  email: "",
  date: dayjs().format("YYYY-MM-DD"),
  adults: 2,
  kids: 1,
  bookingType: "standard",
  remarks: "需要嬰兒澡盆，延後入住。"
});
const finalData = ref({});
const range = ref({
  start: new Date(),
  end: new Date() // Default next day
});

const colorMap = { 0: "bg-green-500", 7: "bg-yellow-400", 15: "bg-red-500" };

const big_attributes = ref([
  {
    // Object
    bar: {
      style: {
        backgroundColor: '#00c951',
      },
    },
    dates: { start: new Date(2025, 11, 1), end: new Date(2025, 11, 11) },
  },
  {
    // Object
    bar: {
      style: {
        backgroundColor: '#fdc700',
      },
    },
    dates: { start: new Date(2025, 11, 11), end: new Date(2025, 11, 13) },
  },
  {
    // Object
    bar: {
      style: {
        backgroundColor: '#fb2c36',
      },
    },
    dates: { start: new Date(2025, 11, 13), end: new Date(2025, 11, 18) },
  },
  {
    // Object
    bar: {
      style: {
        backgroundColor: '#00c951',
      },
    },
    dates: 
    { start: new Date(2025, 11, 18), end: new Date(2026, 11, 31) }
  }
]);

const finishBooking = () => {
  // Determine dates from range picker
  let checkIn = bookingForm.value.date;
  let checkOut = "";

  if (range.value && range.value.start && range.value.end) {
    checkIn = dayjs(range.value.start).format("YYYY-MM-DD");
    checkOut = dayjs(range.value.end).format("YYYY-MM-DD");
  } else {
    // Fallback
    checkIn = dayjs().format("YYYY-MM-DD");
    checkOut = dayjs().add(1, "day").format("YYYY-MM-DD");
  }

  finalData.value = {
    ...bookingForm.value,
    id: "B" + Date.now().toString().slice(-6),
    date: checkIn,
    checkoutDate: checkOut
  };
  bookingStage.value = "finish";
};

const resetBooking = () => {
  bookingStage.value = "init";
  range.value = {
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 1))
  };
};

function moveToday() {
  range.value = {
    start: new Date(),
    end: new Date()
  };
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
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

/* Customizing v-calendar to fit better */
:deep(.vc-container) {
  border: none;
  font-family: inherit;
}
:deep(.vc-header) {
  padding-bottom: 10px;
}
</style>
