<template>
  <div>
    <q-card flat bordered class="q-pa-md bg-white">
      <div class="text-subtitle1 text-primary q-mb-md text-weight-bold">
        <q-icon name="view_quilt" class="q-mr-sm"></q-icon>前端頁面顯示與排序
      </div>
      <div class="text-caption text-grey-7 q-mb-md"
        >控制前端選單的顯示狀態與排列順序 (首頁為固定顯示)。</div
      >

      <q-list bordered separator class="rounded-borders">
        <q-item
          v-for="(page, index) in frontendPages"
          :key="page.id"
          class="q-py-md"
        >
          <q-item-section avatar>
            <q-icon name="drag_handle" color="grey-5"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{
              page.name
            }}</q-item-label>
            <q-item-label caption>ID: {{ page.id }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center q-gutter-md">
              <div class="column">
                <q-btn
                  flat
                  dense
                  icon="keyboard_arrow_up"
                  size="sm"
                  :disable="index === 0 || isViewer"
                  @click="moveFrontendPage(index, -1)"
                ></q-btn>
                <q-btn
                  flat
                  dense
                  icon="keyboard_arrow_down"
                  size="sm"
                  :disable="index === frontendPages.length - 1 || isViewer"
                  @click="moveFrontendPage(index, 1)"
                ></q-btn>
              </div>
              <q-toggle
                v-model="page.visible"
                :disable="isViewer"
                color="primary"
                label="顯示"
                left-label
              ></q-toggle>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="row justify-end q-mt-md">
        <q-btn
          label="儲存設定"
          color="primary"
          icon="save"
          :disable="isViewer"
          unelevated
        ></q-btn>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAdminStore } from "@/stores/AdminAuth";

const adminStore = useAdminStore();

const isViewer = computed(() => adminStore.currentRole === "viewer");

const frontendPages = ref([
  { id: "intro", name: "介紹", visible: true, order: 1 },
  { id: "rooms", name: "房型介紹", visible: true, order: 2 },
  { id: "notices", name: "訂房須知", visible: true, order: 3 },
  { id: "location", name: "地理位置", visible: true, order: 4 },
  { id: "news", name: "最新消息", visible: false, order: 5 }
]);
const moveFrontendPage = (index, direction) => {
  const temp = frontendPages.value[index];
  frontendPages.value[index] = frontendPages.value[index + direction];
  frontendPages.value[index + direction] = temp;
};
</script>
