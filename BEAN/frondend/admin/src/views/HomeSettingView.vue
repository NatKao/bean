<template>
  <div>
    <div class="row q-col-gutter-lg">
      <!-- 左側：編輯區 -->
      <div class="col-12 col-md-5">
        <q-card class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">
              <q-icon name="edit" color="primary" class="q-mr-sm"></q-icon
              >基本資訊編輯
            </div>
            <q-input
              v-model="homeData.description"
              label="網站描述 / 歡迎詞"
              type="textarea"
              outlined
              autogrow
              :readonly="isViewer"
              class="q-mb-md"
            ></q-input>
            <q-separator class="q-my-md"></q-separator>

            <div class="text-subtitle2 q-mb-sm text-grey-8">輪播圖片管理</div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="(img, idx) in homeData.images"
                :key="idx"
                class="col-6 relative-position img-card"
              >
                <q-img
                  :src="img"
                  :ratio="16 / 9"
                  class="rounded-borders shadow-1"
                ></q-img>
                <!-- 懸浮刪除遮罩 -->
                <div
                  v-if="!isViewer"
                  class="img-hover-overlay rounded-borders cursor-pointer"
                  @click="removeHomeImage(idx)"
                >
                  <q-icon name="delete" color="white" size="md"></q-icon>
                </div>
                <q-badge color="primary" floating size="xs">{{
                  idx + 1
                }}</q-badge>
              </div>

              <!-- 新增圖片按鈕 -->
              <div class="col-6" v-if="!isViewer">
                <div
                  class="rounded-borders bg-grey-2 flex flex-center"
                  style="
                    height: 0;
                    padding-bottom: 56.25%;
                    position: relative;
                    cursor: pointer;
                    border: 2px dashed #bdbdbd;
                    transition: all 0.3s;
                  "
                  @click="addHomeImage"
                  onmouseover="this.style.borderColor='#1976d2'; this.style.backgroundColor='#e3f2fd'"
                  onmouseout="this.style.borderColor='#bdbdbd'; this.style.backgroundColor='#f5f5f5'"
                >
                  <div
                    class="absolute-full flex flex-center column text-grey-7"
                  >
                    <q-icon name="add_photo_alternate" size="md"></q-icon>
                    <div class="text-caption q-mt-xs">上傳</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="homeData.images.length < 3"
              class="text-negative text-caption q-mt-sm row items-center"
            >
              <q-icon name="warning" class="q-mr-xs"></q-icon>
              建議至少上傳 3 張圖片以達最佳效果
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              label="捨棄變更"
              flat
              color="grey"
              :disable="isViewer"
            ></q-btn>
            <q-btn
              label="儲存發布"
              unelevated
              color="primary"
              :disable="isViewer"
              icon="save"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <!-- 右側：預覽區 (修改：僅顯示文字描敘，移除圖片預覽) -->
      <div class="col-12 col-md-7">
        <!-- 調整：置中內容，不需要 justify-between 了 -->
        <q-card class="full-height home-preview-card column justify-center">
          <div class="q-pa-lg relative-position text-center" style="z-index: 2">
            <q-badge color="white" text-color="primary" class="q-mb-lg"
              >網站首頁文字預覽</q-badge
            >
            <div class="text-h3 text-weight-bold q-mb-md"
              >歡迎來到 AdminPro</div
            >
            <div
              class="text-h6 text-weight-regular"
              style="white-space: pre-wrap; opacity: 0.95; line-height: 1.6"
              >{{ homeData.description }}</div
            >
            <q-btn
              outline
              color="white"
              label="立即預訂"
              class="q-mt-xl"
              size="lg"
              padding="10px 40px"
            ></q-btn>
          </div>

          <!-- 裝飾背景 (保持模糊或純色，不顯示輪播圖概念) -->
          <div
            class="absolute-full"
            style="
              z-index: 1;
              opacity: 0.1;
              background-image: url('https://placehold.co/800x600/white/white');
              background-size: cover;
              filter: grayscale(100%);
            "
          ></div>

          <!-- 移除了底部的輪播狀態 section -->
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useAdminStore } from "@/stores/AdminAuth";

const adminStore = useAdminStore();

const isViewer = computed(() => adminStore.currentRole === "viewer");

const homeData = reactive({
  description: "歡迎來到最棒的旅宿體驗...",
  images: [
    "https://placehold.co/600x400/orange/white?text=Slide+1",
    "https://placehold.co/600x400/blue/white?text=Slide+2",
    "https://placehold.co/600x400/green/white?text=Slide+3"
  ]
});
const addHomeImage = () =>
  homeData.images.push(
    `https://placehold.co/600x400/purple/white?text=New+Img`
  );
const removeHomeImage = idx => homeData.images.splice(idx, 1);
</script>

<style scoped>
/* Home Settings Redesign Styles */
.home-preview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.img-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.img-card:hover .img-hover-overlay {
  opacity: 1;
}
.custom-tab {
  min-width: 150px;
  font-size: 1.1em;
}
.upload-placeholder {
  border: 2px dashed #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #999;
}
.upload-placeholder:hover {
  border-color: #1976d2;
  color: #1976d2;
  background-color: #f0f9ff;
}
</style>