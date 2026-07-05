<template>
  <div class="global-ui-container">
    <div
      v-if="state.isLoading"
      class="fixed inset-0 z-[9999] bg-gray-50/80 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-wait"
      @click.stop.prevent
    >
      <div
        class="relative w-full max-w-[300px] transform overflow-hidden rounded-3xl bg-white p-6 text-left shadow-xl transition-all dark:bg-gray-900 lg:p-10 scale-100"
      >
        <div class="text-center">
          <div class="relative flex items-center justify-center z-1 mb-7">
            <div
              class="absolute w-20 h-20 bg-primary/20 rounded-full animate-ping"
            ></div>
            <div
              class="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
            ></div>
          </div>
          <div class="mt-6 text-gray-600 font-bold tracking-widest animate-pulse">
            處理中...
          </div>
          <div class="mt-2 text-xs text-gray-400"> 請勿關閉視窗 </div>
        </div>
      </div>

    </div>

    <div
      class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
    >
      <transition-group name="toast">
        <div
          v-for="toast in state.toasts"
          :key="toast.id"
          class="pointer-events-auto relative overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all"
          :class="variantClasses[toast.type].container"
        >
          <div class="flex items-start gap-3">
            <div :class="['-mt-0.5', variantClasses[toast.type].icon]">
              <font-awesome-icon
                :icon="['fas', getIcon(toast.type)]"
                class="text-lg"
              />
            </div>
            <div class="flex-1">
              <h4
                v-if="toast.title"
                class="mb-1 text-sm font-semibold text-gray-800"
              >
                {{ toast.title }}
              </h4>
              <p class="text-sm text-gray-600 leading-snug">{{
                toast.message
              }}</p>
            </div>
            <button
              @click="closeToast(toast.id)"
              class="text-gray-400 hover:text-gray-600"
            >
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-gray-200/50">
            <div
              class="h-full origin-left animate-progress-shrink"
              :class="variantClasses[toast.type].progress"
              :style="{ animationDuration: `${toast.timeout}ms` }"
            ></div>
          </div>
        </div>
      </transition-group>
    </div>

    <div
      v-if="state.confirm.show"
      class="fixed inset-0 z-[9998] flex items-center justify-center px-4"
    >
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="handleConfirm(false)"
      ></div>
      <div
        class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100"
      >

          <div class="relative flex items-center justify-center z-1 mb-7">
            <font-awesome-icon
              :icon="['fas', 'certificate']"
              class="opacity-15"
              :class="currentConfirmVariant.bgTextClass"
              style="width: 90px; height: 90px"
            />
            <span
              class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
            >
              <svg
                :class="currentConfirmVariant.fillClass"
                height="38"
                width="38"
                viewBox="0 0 38 38"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  fill="currentColor"
                  :d="currentConfirmVariant.svgPath"
                ></path>
              </svg>
            </span>
          </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          {{ state.confirm.title }}</h3
        >
        <p class="text-gray-600 mb-6 leading-relaxed">{{
          state.confirm.message
        }}</p>
        <div class="flex justify-end gap-3">
          <button
            @click="handleConfirm(false)"
            class="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
            >取消</button
          >
          <button
            @click="handleConfirm(true)"
            class="px-5 py-2 rounded-xl bg-primary text-white hover:bg-opacity-90 font-medium shadow-md shadow-primary/30 transition-colors"
            >確認</button
          >
        </div>
      </div>
    </div>

    <div
      v-if="state.alert.show"
      class="fixed inset-0 z-[9998] flex items-center justify-center px-4 overflow-y-auto"
    >
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        @click="closeAlert"
      ></div>
      <div
        class="relative w-full max-w-[600px] transform overflow-hidden rounded-3xl bg-white p-6 text-left shadow-xl transition-all dark:bg-gray-900 lg:p-10 scale-100"
      >
        <button
          @click="closeAlert"
          class="absolute right-3 top-3 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
        <div class="text-center">
          <div class="relative flex items-center justify-center z-1 mb-7">
            <font-awesome-icon
              :icon="['fas', 'certificate']"
              class="opacity-15"
              :class="currentAlertVariant.bgTextClass"
              style="width: 90px; height: 90px"
            />
            <span
              class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
            >
              <svg
                :class="currentAlertVariant.fillClass"
                height="38"
                width="38"
                viewBox="0 0 38 38"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  fill="currentColor"
                  :d="currentAlertVariant.svgPath"
                ></path>
              </svg>
            </span>
          </div>
          <h4
            class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm"
          >
            {{ state.alert.title }}
          </h4>
          <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {{ state.alert.message }}
          </p>
          <div class="flex items-center justify-center w-full gap-3 mt-7">
            <button
              @click="closeAlert"
              class="flex justify-center w-full px-6 py-3 text-sm font-medium text-white rounded-lg shadow-theme-xs transition-colors sm:w-auto"
              :class="currentAlertVariant.btnClass"
              type="button"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { msgState, $msg } from "@/assets/utils/msgState";

const state = msgState;

// --- Confirm Logic ---
const handleConfirm = result => {
  $msg._handleConfirm(result);
};

// --- Toast Logic ---
const closeToast = id => {
  $msg.removeToast(id);
};
const getIcon = type => {
  switch (type) {
    case "success":
      return "circle-check";
    case "error":
      return "circle-xmark";
    case "warning":
      return "triangle-exclamation";
    case "info":
      return "circle-info";
    default:
      return "circle-info";
  }
};
const variantClasses = {
  success: {
    container: "border-green-500 bg-green-50",
    icon: "text-green-500",
    progress: "bg-green-500"
  },
  error: {
    container: "border-red-500 bg-red-50",
    icon: "text-red-500",
    progress: "bg-red-500"
  },
  warning: {
    container: "border-yellow-500 bg-yellow-50",
    icon: "text-yellow-600",
    progress: "bg-yellow-500"
  },
  info: {
    container: "border-blue-500 bg-blue-50",
    icon: "text-blue-500",
    progress: "bg-blue-500"
  }
};

const currentConfirmVariant = computed(() => {
  const variant = state.confirm.type || "info";
  return alertVariants[variant];
});
// --- Alert Logic ---
const closeAlert = () => {
  $msg._closeAlert();
};
const currentAlertVariant = computed(() => {
  const variant = state.alert.variant || "success";
  return alertVariants[variant];
});
const alertVariants = {
  success: {
    bgTextClass: "text-green-500",
    fillClass: "text-green-600",
    btnClass: "bg-green-500 hover:bg-green-600",
    svgPath:
      "M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z"
  },
  info: {
    bgTextClass: "text-blue-500",
    fillClass: "text-blue-600",
    btnClass: "bg-blue-500 hover:bg-blue-600",
    svgPath:
      "M5.85547 18.9998C5.85547 11.7396 11.7411 5.854 19.0013 5.854C26.2615 5.854 32.1471 11.7396 32.1471 18.9998C32.1471 26.2601 26.2615 32.1457 19.0013 32.1457C11.7411 32.1457 5.85547 26.2601 5.85547 18.9998ZM19.0013 2.854C10.0842 2.854 2.85547 10.0827 2.85547 18.9998C2.85547 27.9169 10.0842 35.1457 19.0013 35.1457C27.9184 35.1457 35.1471 27.9169 35.1471 18.9998C35.1471 10.0827 27.9184 2.854 19.0013 2.854ZM16.9999 11.9145C16.9999 13.0191 17.8953 13.9145 18.9999 13.9145H19.0015C20.106 13.9145 21.0015 13.0191 21.0015 11.9145C21.0015 10.81 20.106 9.91454 19.0015 9.91454H18.9999C17.8953 9.91454 16.9999 10.81 16.9999 11.9145ZM19.0014 27.8171C18.173 27.8171 17.5014 27.1455 17.5014 26.3171V17.3293C17.5014 16.5008 18.173 15.8293 19.0014 15.8293C19.8299 15.8293 20.5014 16.5008 20.5014 17.3293L20.5014 26.3171C20.5014 27.1455 19.8299 27.8171 19.0014 27.8171Z"
  },
  warning: {
    bgTextClass: "text-yellow-500",
    fillClass: "text-yellow-600",
    btnClass: "bg-yellow-500 hover:bg-yellow-600",
    svgPath:
      "M32.1445 19.0002C32.1445 26.2604 26.2589 32.146 18.9987 32.146C11.7385 32.146 5.85287 26.2604 5.85287 19.0002C5.85287 11.7399 11.7385 5.85433 18.9987 5.85433C26.2589 5.85433 32.1445 11.7399 32.1445 19.0002ZM18.9987 35.146C27.9158 35.146 35.1445 27.9173 35.1445 19.0002C35.1445 10.0831 27.9158 2.85433 18.9987 2.85433C10.0816 2.85433 2.85287 10.0831 2.85287 19.0002C2.85287 27.9173 10.0816 35.146 18.9987 35.146ZM21.0001 26.0855C21.0001 24.9809 20.1047 24.0855 19.0001 24.0855L18.9985 24.0855C17.894 24.0855 16.9985 24.9809 16.9985 26.0855C16.9985 27.19 17.894 28.0855 18.9985 28.0855L19.0001 28.0855C20.1047 28.0855 21.0001 27.19 21.0001 26.0855ZM18.9986 10.1829C19.827 10.1829 20.4986 10.8545 20.4986 11.6829L20.4986 20.6707C20.4986 21.4992 19.827 22.1707 18.9986 22.1707C18.1701 22.1707 17.4986 21.4992 17.4986 20.6707L17.4986 11.6829C17.4986 10.8545 18.1701 10.1829 18.9986 10.1829Z"
  },
  error: {
    bgTextClass: "text-red-500",
    fillClass: "text-red-600",
    btnClass: "bg-red-500 hover:bg-red-600",
    svgPath:
      "M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
  }
};
</script>

<style scoped>
/* Toast 進出動畫 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-active {
  position: absolute;
}

/* 進度條動畫 (從 100% 縮減到 0%) */
@keyframes progress-shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
.animate-progress-shrink {
  animation-name: progress-shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
</style>
