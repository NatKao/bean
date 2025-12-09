<template>
  <div>
    <div class="text-subtitle1 text-primary q-mb-md text-weight-bold">
      <q-icon name="rate_review" class="q-mr-sm"></q-icon>顧客評價管理
    </div>

    <!-- 篩選器 -->
    <q-card class="q-pa-md bg-white q-mb-md" flat bordered>
      <div class="row q-gutter-md items-center">
        <div class="col-auto">
          <q-toggle
            v-model="reviewFilter.unreadOnly"
            label="僅顯示未讀評價"
            color="orange"
            icon="mark_email_unread"
          ></q-toggle>
        </div>
        <q-separator vertical class="q-mx-md"></q-separator>
        <div class="col-12 col-md-4">
          <q-input
            outlined
            dense
            v-model="reviewFilter.dateRange"
            label="查詢日期區間"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="reviewFilter.dateRange"
                    range
                    mask="YYYY/MM/DD"
                  >
                    <div class="row items-center justify-end"
                      ><q-btn v-close-popup label="Close" color="primary" flat
                    /></div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn color="primary" icon="search" label="查詢" unelevated></q-btn>
        </div>
      </div>
    </q-card>

    <!-- 評價列表 Table -->
    <q-table
      :rows="reviews"
      :columns="[
        {
          name: 'date',
          label: '日期',
          field: 'date',
          align: 'left',
          sortable: true
        },
        {
          name: 'customer',
          label: '顧客姓名',
          field: 'customer',
          align: 'left'
        },
        {
          name: 'rating',
          label: '評分',
          field: 'rating',
          align: 'center',
          sortable: true
        },
        {
          name: 'content',
          label: '評價內容',
          field: 'content',
          align: 'left',
          style: 'max-width: 300px'
        },
        {
          name: 'status',
          label: '狀態',
          field: 'status',
          align: 'center'
        },
        { name: 'action', label: '操作', align: 'center' }
      ]"
      row-key="id"
      flat
      bordered
      class="bg-white"
    >
      <!-- 自訂每一列的樣式: 未讀顯示黃色背景 -->
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="{
            'review-unread':
              props.row.status === 'unread' && reviewFilter.unreadOnly === false
          }"
        >
          <q-td key="date" :props="props">{{ props.row.date }}</q-td>
          <q-td key="customer" :props="props">{{
            userRole === "dev"
              ? maskName(props.row.customer)
              : props.row.customer
          }}</q-td>
          <q-td key="rating" :props="props">
            <div class="text-orange">
              <q-icon
                v-for="n in 5"
                :key="n"
                :name="n <= props.row.rating ? 'star' : 'star_border'"
              ></q-icon>
            </div>
          </q-td>
          <q-td key="content" :props="props">
            <div class="ellipsis">{{ props.row.content }}</div>
          </q-td>
          <q-td key="status" :props="props">
            <q-badge
              :color="props.row.status === 'unread' ? 'orange' : 'green'"
              :label="props.row.status === 'unread' ? '未讀' : '已回覆'"
            ></q-badge>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              size="sm"
              color="primary"
              outline
              label="查看/回覆"
              @click="openReviewDialog(props.row)"
            ></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- 回覆視窗 Dialog -->
    <q-dialog v-model="reviewDialog.show">
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">評價詳情</div>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="reviewDialog.currentReview">
          <div class="row q-mb-md">
            <div class="col-6 text-grey-8"
              >顧客：{{
                userRole === "dev"
                  ? maskName(reviewDialog.currentReview.customer)
                  : reviewDialog.currentReview.customer
              }}</div
            >
            <div class="col-6 text-right text-grey-6">{{
              reviewDialog.currentReview.date
            }}</div>
          </div>
          <div class="q-pa-md bg-grey-2 rounded-borders q-mb-md">
            <div class="text-orange q-mb-xs">
              評分: {{ reviewDialog.currentReview.rating }} 星
            </div>
            <div class="text-body1">{{
              reviewDialog.currentReview.content
            }}</div>
          </div>

          <q-input
            v-model="reviewDialog.replyText"
            type="textarea"
            label="撰寫回覆"
            outlined
            rows="4"
            :readonly="isViewer"
            placeholder="感謝您的入住..."
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="關閉" color="grey" v-close-popup></q-btn>
          <q-btn
            flat
            label="送出回覆"
            color="primary"
            @click="submitReply"
            :disable="isViewer"
          ></q-btn>
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

const reviews = ref([
  {
    id: 1,
    date: "2023-12-05",
    customer: "陳小美",
    rating: 5,
    content: "房間非常乾淨，服務也很棒！",
    status: "unread",
    reply: ""
  },
  {
    id: 2,
    date: "2023-12-04",
    customer: "林大山",
    rating: 3,
    content: "隔音稍微有點不好，但整體還可以。",
    status: "read",
    reply: "感謝您的反饋，我們會加強隔音設施。"
  },
  {
    id: 3,
    date: "2023-12-01",
    customer: "王阿明",
    rating: 4,
    content: "早餐很好吃，位置方便。",
    status: "unread",
    reply: ""
  }
]);
const reviewFilter = reactive({
  unreadOnly: false,
  dateRange: { from: "2023/01/01", to: "2023/12/31" }
});
const reviewDialog = reactive({
  show: false,
  currentReview: null,
  replyText: ""
});

const openReviewDialog = review => {
  reviewDialog.currentReview = review;
  reviewDialog.replyText = review.reply || "";
  reviewDialog.show = true;
  // 若是未讀，點擊後可自動標為已讀 (或是回覆後才標示，這邊示範點擊即標示)
  if (review.status === "unread") review.status = "read";
};
const submitReply = () => {
  if (reviewDialog.currentReview) {
    reviewDialog.currentReview.reply = reviewDialog.replyText;
    reviewDialog.currentReview.status = "replied"; // 假設有已回覆狀態
    $q.notify({ message: "回覆已送出", color: "positive" });
  }
  reviewDialog.show = false;
};

const maskName = name => {
  if (!name) return "";
  if (name.length === 2) return name[0] + "*";
  if (name.length >= 3)
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  return name;
};
</script>

<style scoped>
/* 評價表格樣式 */
.review-unread {
  background-color: #fef3c7; /* 淺黃色背景標示未讀 */
  font-weight: 500;
}
</style>