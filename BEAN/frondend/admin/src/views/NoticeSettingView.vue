<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">訂房須知設定</div>
      <q-btn
        label="新增須知"
        color="primary"
        icon="add"
        :disable="isViewer"
        @click="openNoticeDialog()"
      ></q-btn>
    </div>
    <div class="text-caption text-grey q-mb-sm">* 使用箭頭調整排序</div>

    <q-list bordered separator class="rounded-borders bg-white">
      <q-item v-for="(notice, index) in notices" :key="notice.id">
        <q-item-section avatar>
          <div class="column">
            <q-btn
              flat
              dense
              icon="keyboard_arrow_up"
              size="sm"
              :disable="index === 0 || isViewer"
              @click="moveNotice(index, -1)"
            ></q-btn>
            <q-btn
              flat
              dense
              icon="keyboard_arrow_down"
              size="sm"
              :disable="index === notices.length - 1 || isViewer"
              @click="moveNotice(index, 1)"
            ></q-btn>
          </div>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-bold">{{
            notice.title
          }}</q-item-label>
          <q-item-label caption lines="2">{{ notice.content }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row">
            <q-btn
              flat
              round
              icon="edit"
              color="grey-7"
              @click="openNoticeDialog(notice)"
            ></q-btn>
            <q-btn
              flat
              round
              icon="delete"
              color="negative"
              :disable="isViewer"
              @click="deleteNotice(index)"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 新增: 須知編輯視窗 -->
    <q-dialog v-model="noticeDialog.show">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{
            noticeDialog.isEdit ? "編輯須知" : "新增須知"
          }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="noticeDialog.data.title"
            label="標題"
            outlined
          ></q-input>
          <q-input
            v-model="noticeDialog.data.content"
            label="內文"
            type="textarea"
            outlined
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="grey" v-close-popup></q-btn>
          <q-btn flat label="確認" color="primary" @click="saveNotice"></q-btn>
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

const notices = ref([
  { id: 1, title: "入住時間", content: "下午 15:00 後" },
  { id: 2, title: "退房時間", content: "上午 11:00 前" },
  { id: 3, title: "禁菸說明", content: "全館禁菸，違者罰款" }
]);
const noticeDialog = reactive({
  show: false,
  isEdit: false,
  data: { title: "", content: "" }
});
const moveNotice = (index, direction) => {
  const temp = notices.value[index];
  notices.value[index] = notices.value[index + direction];
  notices.value[index + direction] = temp;
};
const openNoticeDialog = (row = null) => {
  noticeDialog.isEdit = !!row;
  noticeDialog.data = row
    ? JSON.parse(JSON.stringify(row))
    : { id: Date.now(), title: "", content: "" };
  noticeDialog.show = true;
};
const saveNotice = () => {
  if (noticeDialog.isEdit) {
    const idx = notices.value.findIndex(n => n.id === noticeDialog.data.id);
    if (idx !== -1) notices.value[idx] = noticeDialog.data;
  } else {
    notices.value.push(noticeDialog.data);
  }
  noticeDialog.show = false;
};
const deleteNotice = index => notices.value.splice(index, 1);
</script>
