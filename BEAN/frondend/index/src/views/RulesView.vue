<template>
  <section
    class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative"
    >
      <div
        class="p-8 md:p-10 border-b border-gray-100 flex-none text-center bg-white z-10"
      >
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
                <font-awesome-icon
                  :icon="rule.icon"
                  class="mr-3 text-primary"
                />
                {{ rule.title }}
              </h3>
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                :class="[
                  'text-gray-400 transition-transform',
                  rule.isOpen ? 'rotate-180' : ''
                ]"
              />
            </button>
            <transition name="accordion">
              <div
                v-if="rule.isOpen"
                class="bg-white p-5 border-t border-gray-100"
              >
                <ul
                  class="list-disc list-inside space-y-2 text-gray-600 text-sm ml-2"
                >
                  <li v-for="(item, i) in rule.content" :key="i">{{ item }}</li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

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
</script>
