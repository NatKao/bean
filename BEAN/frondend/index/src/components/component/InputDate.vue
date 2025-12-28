<template>
  <DatePicker
    v-model="proxyDate"
    :attributes="attributes"
    :popover="{ visibility: 'click' }"
    :locale="{
      id: 'zh-TW',
      firstDayOfWeek: 2,
      masks: { weekdays: 'WW', title: 'YYYY-MM' }
    }"
    :max-date="maxDate"
    :min-date="minDate"
    is-required
  >
    <!-- 使用 slot 自定義輸入框與按鈕 -->
    <template #default="{ togglePopover, inputValue, inputEvents }">
      <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden items-center bg-white dark:bg-gray-700">
        <!-- 輸入框：綁定 inputValue 與 inputEvents 以支援手動輸入 -->
        <input
          :value="inputValue"
          v-on="inputEvents"
          placeholder="YYYY/MM/DD"
          class="flex-grow px-3 py-2 bg-transparent outline-none text-gray-700 dark:text-gray-200 w-full"
        />
        
        <!-- 小日曆 Icon 按鈕 -->
        <button
          type="button"
          :class="[
            'flex justify-center items-center px-3 py-2 border-l border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors',
            isAlwaysShow ? '' : 'md:hidden'
          ]"
          @click="togglePopover"
        >
          <!-- 使用 SVG icon 替代原本的 img 標籤，確保顯示正常 -->
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 text-gray-500 dark:text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </template>

    <!-- 底部插槽 -->
    <template #footer>
      <!-- <div class="w-full px-4 pb-3 pt-2">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-2 rounded-md transition-colors"
          @click="moveToToday"
        >
          今日
        </button>
      </div> -->
    </template>
  </DatePicker>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  // 接收父層傳入的日期 (v-model)
  modelValue: {
    type: [Date, String, Object],
    default: null
  },
  // 控制是否在所有裝置都顯示 Icon (原本的邏輯)
  isAlwaysShow: {
    type: Boolean,
    default: false
  }
});

// 定義 Emits，用於通知父層更新
const emit = defineEmits(['update:modelValue']);

// 使用 computed 建立雙向綁定代理
// 當內部日期改變時，會自動 emit update:modelValue 給父元件
const proxyDate = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  }
});

// 日曆屬性 (標示今天)
const attributes = ref([
  {
    key: 'today',
    dot: {
      color: 'red',
    },
    dates: new Date()
  }
]);

// 日期範圍限制
const minDate = dayjs().add(1, 'day').toDate(); // 明天
const maxDate = dayjs().add(1, 'year').endOf('month').toDate(); // 一年後
</script>