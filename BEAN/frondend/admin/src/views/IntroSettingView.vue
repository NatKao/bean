<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">介紹頁籤管理</div>
      <q-btn
        label="新增頁籤"
        color="primary"
        icon="add"
        :disable="isViewer"
        @click="openTabDialog()"
      ></q-btn>
    </div>

    <q-table
      :rows="introTabs"
      :columns="[
        {
          name: 'title',
          label: '頁籤標題',
          field: 'title',
          align: 'left'
        },
        {
          name: 'content',
          label: '內文摘要',
          field: 'content',
          align: 'left',
          format: val => (val.length > 20 ? val.substring(0, 20) + '...' : val)
        },
        {
          name: 'images',
          label: '圖片數',
          field: row => row.images.length,
          align: 'center'
        },
        { name: 'actions', label: '操作', align: 'right' }
      ]"
      row-key="id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            icon="edit"
            color="primary"
            @click="openTabDialog(props.row)"
          ></q-btn>
          <q-btn
            flat
            round
            icon="delete"
            color="negative"
            :disable="isViewer"
            @click="deleteTab(props.row.id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Tab 編輯 Dialog -->
    <q-dialog v-model="tabDialog.show">
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">{{
            tabDialog.isEdit ? "編輯頁籤" : "新增頁籤"
          }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="tabDialog.data.title"
            label="頁籤標題"
            outlined
          ></q-input>
          <q-input
            v-model="tabDialog.data.content"
            label="內文"
            type="textarea"
            outlined
          ></q-input>
          <div class="text-subtitle2">圖片管理 (模擬)</div>
          <q-btn
            size="sm"
            color="secondary"
            label="上傳圖片 (模擬)"
            icon="cloud_upload"
          ></q-btn>
          <div>已選擇 {{ tabDialog.data.images.length }} 張圖片</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="grey" v-close-popup></q-btn>
          <q-btn flat label="確認" color="primary" @click="saveTab"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useAdminStore } from "@/stores/AdminAuth";

const adminStore = useAdminStore();

const isViewer = computed(() => adminStore.currentRole === "viewer");

const introTabs = ref([
  {
    id: 1,
    title: "關於我們",
    content: "我們的故事始於...",
    images: ["img1.jpg"]
  },
  {
    id: 2,
    title: "房型介紹",
    content: "豪華雙人房...",
    images: ["img2.jpg", "img3.jpg"]
  }
]);


const tabDialog = reactive({
  show: false,
  isEdit: false,
  data: { title: "", content: "", images: [] }
});
const openTabDialog = (row = null) => {
  tabDialog.isEdit = !!row;
  tabDialog.data = row
    ? JSON.parse(JSON.stringify(row))
    : { id: Date.now(), title: "", content: "", images: [] };
  tabDialog.show = true;
};
const saveTab = () => {
  if (tabDialog.isEdit) {
    const idx = introTabs.value.findIndex(t => t.id === tabDialog.data.id);
    if (idx !== -1) introTabs.value[idx] = tabDialog.data;
  } else {
    introTabs.value.push(tabDialog.data);
  }
  tabDialog.show = false;
};
const deleteTab = id =>
  (introTabs.value = introTabs.value.filter(t => t.id !== id));
</script>
