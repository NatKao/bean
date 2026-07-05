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
            :min-date="datePickerRanger.min_date"
            :max-date="datePickerRanger.max_date"
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
import { ref, inject, toRaw, onMounted } from "vue";
import dayjs from "dayjs";

const $room = inject("$room");

const datePickerRanger = ref({
  min_date: dayjs().toDate(),
  max_date: dayjs().add(1, "year").toDate()
});

onMounted(() => {
  $room.checkRoom();
  setTimeout(async () => {
    $room.checkRoom();
  }, 1000 * 60 * 60);

  checkData();
});

const checkData = () => {
  if($room.state.is_status) {
    setTimeout(() => {
      checkData();
    }, 1000);
    return;
  }

  // false 處理資料 
  const limitTime = dayjs().add(1, "year").valueOf();
  const roomData = $room.state.data.filter((item) => {
    // 將每一筆的 in 和 out 也轉成毫秒
    const inTime = dayjs(item.checkin_date).valueOf();
    const outTime = dayjs(item.checkout_date).valueOf();
    // 條件：in 的時間 <= 極限值，且 out 的時間 <= 極限值
    return inTime <= limitTime && outTime <= limitTime;
  });
  roomData.sort((a, b) => dayjs(a.checkin_date).valueOf() - dayjs(b.checkin_date).valueOf());
  
  const gg = structuredClone(sample);
  gg.bar.style.backgroundColor = "#00c951";
  const yy = structuredClone(sample);
  yy.bar.style.backgroundColor = "#fdc700";
  const rr = structuredClone(sample);
  rr.bar.style.backgroundColor = "#fb2c36";

  let pre_data = null;
  big_attributes.value = [];
  roomData.forEach((e, idx) => {
    const now = dayjs().format('YYYY-MM-DD');
    const in_dt = dayjs(e.checkin_date);
    const in_dt_text = in_dt.format('YYYY-MM-DD');
    const out_dt = dayjs(e.checkout_date);
    const out_dt_text = out_dt.format('YYYY-MM-DD');
    if (idx === 0) {
      if (in_dt_text !== now) {
        const s = structuredClone(dSample);
        s.start = dayjs().toDate();
        s.end = dayjs(e.checkin_date).toDate();
        const gg = structuredClone(sample);
        gg.bar.style.backgroundColor = "#00c951";
        gg.dates.push(s);
        big_attributes.value.push(gg);
      }
      
      const s = structuredClone(dSample);
      s.start = in_dt.toDate();
      s.end = out_dt.toDate();
      if (e.is_charter) {
        const rr = structuredClone(sample);
        rr.bar.style.backgroundColor = "#fb2c36";
        rr.dates.push(s);
        big_attributes.value.push(rr);
      } else {
        const yy = structuredClone(sample);
        yy.bar.style.backgroundColor = "#fdc700";
        yy.dates.push(s);
        big_attributes.value.push(yy);
      }
      pre_data = structuredClone(toRaw(e));
    } else  {
      const pre_out_dt = dayjs(pre_data.checkout_date);
      const pre_out_dt_text = pre_out_dt.format('YYYY-MM-DD');
      if (in_dt_text !== pre_out_dt_text) {
        const s = structuredClone(dSample);
        s.start = pre_out_dt.toDate();
        s.end = in_dt.toDate();
        const gg = structuredClone(sample);
        gg.bar.style.backgroundColor = "#00c951";
        gg.dates.push(s);
        big_attributes.value.push(gg);
      }

      const s = structuredClone(dSample);
      s.start = in_dt.toDate();
      s.end = out_dt.toDate();
      if (e.is_charter) {
        const rr = structuredClone(sample);
        rr.bar.style.backgroundColor = "#fb2c36";
        rr.dates.push(s);
        big_attributes.value.push(rr);
      } else {
        const yy = structuredClone(sample);
        yy.bar.style.backgroundColor = "#fdc700";
        yy.dates.push(s);
        big_attributes.value.push(yy);
      }

      if (idx === roomData.length - 1) {
        const last = dayjs().add(1, "year").format('YYYY-MM-DD');
        if (out_dt_text !== last) {
          const s = structuredClone(dSample);
          s.start = out_dt.toDate();
          s.end = dayjs().add(1, "year").toDate();
          const gg = structuredClone(sample);
          gg.bar.style.backgroundColor = "#00c951";
          gg.dates.push(s);
          big_attributes.value.push(gg);
        }
      } else {
        pre_data = structuredClone(toRaw(e));
      }
    }
  });
}

const colorMap = { 0: "bg-green-500", 7: "bg-yellow-400", 15: "bg-red-500" };

const sample = {
  bar: {
    style: {
      backgroundColor: '',
    },
  },
  dates: [],
};
const dSample = { start: null, end: null };
const big_attributes = ref([
  {
    // Object
    bar: {
      style: {
        backgroundColor: '#00c951',
      },
    },
    dates: { start: datePickerRanger.value.min_date, end: datePickerRanger.value.max_date },
  },
  {
    // Object
    bar: {
      style: {
        backgroundColor: '#fdc700',
      },
    },
    dates: [{ start: new Date(2026, 11, 11), end: new Date(2026, 11, 13) },
      { start: new Date(2026, 11, 21), end: new Date(2026, 11, 23) }
    ],
  },
  {
    // Object
    bar: {
      style: {
        backgroundColor: '#fb2c36',
      },
    },
    dates: { start: new Date(2026, 11, 13), end: new Date(2026, 11, 18) },
  },
]);

const roomData = ref({});
const range = ref({
  start: new Date(),
  end: new Date() // Default next day
});
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

  roomData.value = {
    ...bookingForm.value,
    id: "B" + Date.now().toString().slice(-6),
    date: checkIn,
    checkoutDate: checkOut
  };
};

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
