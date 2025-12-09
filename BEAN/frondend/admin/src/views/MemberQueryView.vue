<template>
  <div>
    <div class="text-h5 q-mb-md">會員 / 訂房查詢</div>

    <!-- 修改 2: Tab 加入 inline-label 讓文字圖案同一排 -->
    <q-tabs
      v-model="queryTab"
      align="justify"
      class="text-primary q-mb-md"
      active-color="primary"
      indicator-color="primary"
      inline-label
    >
      <q-tab
        name="member"
        label="6-1 會員查詢"
        icon="person_search"
        class="custom-tab"
      ></q-tab>
      <q-tab
        name="booking"
        label="6-2 訂房單號查詢"
        icon="receipt_long"
        class="custom-tab"
      ></q-tab>
    </q-tabs>

    <q-tab-panels v-model="queryTab" animated>
      <!-- 6-1 會員查詢 (修改: 增加 q-pa-md 防止文字被切斷) -->
      <q-tab-panel name="member" class="q-pa-md">
        <div class="row q-gutter-md q-mb-md items-center">
          <div class="col-auto">
            <q-btn-toggle
              v-model="memberSearchType"
              push
              glossy
              toggle-color="primary"
              :options="[
                { label: '電話/姓名', value: 'phone' },
                { label: '日期區間', value: 'date' }
              ]"
            />
          </div>
          <div class="col-5">
            <q-input
              v-if="memberSearchType === 'phone'"
              v-model="memberSearch"
              outlined
              dense
              label="輸入會員電話或姓名查詢"
            >
              <template v-slot:append
                ><q-btn round dense flat icon="search" @click="doMemberSearch"
              /></template>
            </q-input>
            <q-input
              v-else
              outlined
              dense
              v-model="memberSearchDateRange"
              label="選擇查詢日期區間"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="memberSearchDateRange"
                      range
                      mask="YYYY/MM/DD"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:after
                ><q-btn
                  round
                  dense
                  flat
                  icon="search"
                  color="primary"
                  @click="doMemberSearch"
              /></template>
            </q-input>
          </div>
        </div>

        <!-- 上 Table: 會員列表 (僅在電話查詢模式顯示) -->
        <div
          v-if="memberSearchType === 'phone' && displayMemberList.length > 0"
          class="q-mb-lg"
        >
          <div class="text-subtitle1 text-grey-8 q-mb-xs">
            <q-icon name="list" /> 會員列表 (點擊查看訂房紀錄)
          </div>
          <q-table
            :rows="displayMemberList"
            :columns="memberColumns"
            row-key="id"
            flat
            bordered
            :pagination="{ rowsPerPage: 5 }"
            @row-click="onMemberRowClick"
            selection="single"
            v-model:selected="selectedMembers"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                {{ maskName(props.value) }}
              </q-td>
            </template>
            <template v-slot:body-cell-phone="props">
              <q-td :props="props">
                <span v-if="userRole === 'dev'">09**-***-***</span>
                <span v-else>{{ props.value }}</span>
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- 下 Table: 訂房紀錄 -->
        <div
          v-if="
            bottomTableData.length > 0 ||
            (memberSearchType === 'date' && hasSearched)
          "
        >
          <q-separator
            class="q-mb-md"
            v-if="memberSearchType === 'phone'"
          ></q-separator>
          <div class="text-subtitle1 text-primary q-mb-xs">
            <q-icon name="history" />
            {{
              memberSearchType === "phone"
                ? selectedMembers.length > 0
                  ? selectedMembers[0].name + " 的訂房紀錄"
                  : "請選擇上方會員"
                : "區間內所有訂房"
            }}
          </div>
          <q-table
            :rows="bottomTableData"
            :columns="bookingHistoryColumns"
            row-key="id"
            flat
            bordered
          >
            <!-- 日期查詢模式下，多顯示會員姓名欄位 -->
            <template v-slot:body-cell-memberName="props">
              <q-td :props="props">
                {{ maskName(props.value) }}
              </q-td>
            </template>
            <template v-slot:body-cell-price="props">
              <q-td :props="props">
                <span v-if="userRole === 'dev'">$****</span>
                <span v-else>{{ formatCurrency(props.value) }}</span>
              </q-td>
            </template>
          </q-table>
        </div>
        <div
          v-else-if="
            memberSearchType === 'phone' &&
            displayMemberList.length > 0 &&
            selectedMembers.length === 0
          "
          class="text-grey q-pa-md text-center"
        >
          請點選上方會員列表以查看詳細資料
        </div>
        <div v-else-if="hasSearched" class="text-grey q-pa-md text-center">
          查無相關資料
        </div>
      </q-tab-panel>

      <!-- 6-2 訂房單號查詢 -->
      <q-tab-panel name="booking" class="q-pa-none">
        <div class="row q-gutter-md q-mb-md">
          <q-input
            v-model="bookingIdSearch"
            outlined
            dense
            label="輸入訂房單號"
            class="col-4"
          >
            <template v-slot:append
              ><q-btn round dense flat icon="search"
            /></template>
          </q-input>
        </div>
        <q-card flat bordered v-if="foundBooking">
          <q-card-section>
            <!-- 修改: 將狀態 Chip 移回右上角，與標題並排 -->
            <div class="row items-center justify-between no-wrap">
              <div class="text-h6">訂房單號: {{ foundBooking.id }}</div>
              <!-- 修改點：加大狀態標籤 -->
              <q-chip
                :color="getStatusColor(foundBooking.status)"
                text-color="white"
                size="xl"
                >{{ foundBooking.status }}</q-chip
              >
            </div>

            <div class="q-mt-md">
              <!-- 修改: 增加一個 row wrapper，並將內容限制在 col-md-8 (2/3 寬度) -->
              <div class="row">
                <div class="col-12 col-md-8">
                  <!-- 修改: 增加欄位間距 (gutter-x-xl) 並調整文字底部 padding (q-pb-xs) -->
                  <q-list separator>
                    <!-- Row 1: 訂房人 & 電話 -->
                    <q-item class="q-pt-md q-pb-xs">
                      <q-item-section>
                        <div class="row q-col-gutter-x-xl">
                          <div class="col-6">
                            <div class="text-caption text-grey">訂房人</div>
                            <div v-if="userRole === 'dev'" class="text-body1"
                              >{{ maskName(foundBooking.name) }} (Dev
                              Hidden)</div
                            >
                            <div v-else class="text-body1">{{
                              foundBooking.name
                            }}</div>
                          </div>
                          <div class="col-6">
                            <div class="text-caption text-grey">電話</div>
                            <div v-if="userRole === 'dev'" class="text-body1"
                              >09**-***-***</div
                            >
                            <div v-else class="text-body1">{{
                              foundBooking.phone
                            }}</div>
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>

                    <!-- Row 2: 日期 & 人數 -->
                    <q-item class="q-pt-md q-pb-xs">
                      <q-item-section>
                        <div class="row q-col-gutter-x-xl">
                          <div class="col-6">
                            <div class="text-caption text-grey"
                              >入住 / 退房日期</div
                            >
                            <div class="text-body1"
                              >{{ foundBooking.checkIn }} ~
                              {{ foundBooking.checkOut }}</div
                            >
                          </div>
                          <div class="col-6">
                            <div class="text-caption text-grey">人數</div>
                            <div class="text-body1">
                              {{ foundBooking.pax.adults }} 位大人
                              <span v-if="foundBooking.pax.children > 0"
                                >,
                                {{ foundBooking.pax.children }}
                                位小孩</span
                              >
                            </div>
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>

                    <!-- Row 3: 備註 -->
                    <q-item class="q-pt-md q-pb-xs">
                      <q-item-section>
                        <q-item-label caption>備註</q-item-label>
                        <q-item-label class="text-grey-8 text-body1">{{
                          foundBooking.notes
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <!-- 右側留空或可放其他資訊，達成 2/3 寬度效果 -->
                <div class="col-12 col-md-4"></div>
              </div>

              <!-- 底部按鈕區 -->
              <div class="row justify-end items-center q-mt-lg q-px-sm">
                <div class="q-gutter-md">
                  <!-- 修改點：按鈕尺寸改為 md -->
                  <q-btn
                    label="修改狀態"
                    size="md"
                    outline
                    color="primary"
                    :disable="isViewer"
                    @click="openStatusDialog(foundBooking)"
                  ></q-btn>
                  <q-btn
                    label="取消訂單"
                    size="md"
                    outline
                    color="negative"
                    :disable="isViewer"
                    @click="cancelOrder(foundBooking)"
                  ></q-btn>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div v-else class="text-grey q-pa-md">請輸入查詢單號 (試試: B001)</div>

        <q-dialog v-model="statusDialog.show">
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">修改訂單狀態</div>
            </q-card-section>
            <q-card-section class="q-gutter-md">
              <q-select
                v-model="statusDialog.status"
                :options="['已確認', '已入住', '已退房', '已取消']"
                label="選擇新狀態"
                outlined
              ></q-select>
              <q-input
                v-model="statusDialog.reason"
                label="變更理由"
                type="textarea"
                outlined
              ></q-input>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="取消" color="grey" v-close-popup></q-btn>
              <q-btn
                flat
                label="確認變更"
                color="primary"
                @click="confirmStatusChange"
              ></q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useAdminStore } from "@/stores/AdminAuth";

const adminStore = useAdminStore();

const isViewer = computed(() => adminStore.currentRole === "viewer");


const queryTab = ref("member");
const memberSearchType = ref("phone");
const memberSearch = ref("");
const memberSearchDateRange = ref({ from: "2023/01/01", to: "2023/12/31" });
const hasSearched = ref(false);

const memberList = ref([
  {
    id: 1,
    name: "王大明",
    phone: "0911222333",
    history: [
      {
        id: 101,
        date: "2023-09-01",
        roomType: "雙人房",
        price: 2000,
        status: "已完成"
      },
      {
        id: 102,
        date: "2023-08-15",
        roomType: "四人房",
        price: 4000,
        status: "已取消"
      },
      {
        id: 103,
        date: "2023-01-20",
        roomType: "雙人房",
        price: 2200,
        status: "已完成"
      }
    ]
  },
  {
    id: 2,
    name: "李四",
    phone: "0955666777",
    history: [
      {
        id: 201,
        date: "2023-10-10",
        roomType: "單人房",
        price: 1500,
        status: "待入住"
      }
    ]
  }
]);

const displayMemberList = ref([]);
const selectedMembers = ref([]);
const bottomTableData = ref([]);

const memberColumns = [
  { name: "name", label: "姓名", field: "name", align: "left" },
  { name: "phone", label: "電話", field: "phone", align: "left" },
  { name: "id", label: "會員編號", field: "id", align: "center" }
];

const bookingHistoryColumns = computed(() => {
  const cols = [
    { name: "date", label: "日期", field: "date", align: "left" },
    { name: "roomType", label: "房型", field: "roomType", align: "left" },
    { name: "status", label: "狀態", field: "status", align: "center" },
    { name: "price", label: "金額", field: "price", align: "right" }
  ];
  if (memberSearchType.value === "date") {
    cols.unshift({
      name: "memberName",
      label: "會員姓名",
      field: "memberName",
      align: "left"
    });
  }
  return cols;
});

const doMemberSearch = () => {
  $q.loading.show();
  hasSearched.value = true;
  selectedMembers.value = [];
  bottomTableData.value = [];

  setTimeout(() => {
    $q.loading.hide();
    if (memberSearchType.value === "phone") {
      if (!memberSearch.value) {
        displayMemberList.value = memberList.value;
      } else {
        const k = memberSearch.value;
        displayMemberList.value = memberList.value.filter(
          m => m.name.includes(k) || m.phone.includes(k)
        );
      }
    } else {
      let allHistory = [];
      memberList.value.forEach(m => {
        m.history.forEach(h => {
          allHistory.push({ ...h, memberName: m.name });
        });
      });
      bottomTableData.value = allHistory;
    }
  }, 500);
};

const onMemberRowClick = (evt, row) => {
  selectedMembers.value = [row];
  bottomTableData.value = row.history;
};

const bookingIdSearch = ref("");
const foundBooking = computed(() => {
  if (bookingIdSearch.value === "B001") {
    return {
      id: "B001",
      name: "張三豐",
      phone: "0999888777",
      status: "已確認",
      checkIn: "2023-12-25",
      checkOut: "2023-12-27",
      pax: { adults: 2, children: 1 },
      notes: "需要嬰兒澡盆，延後入住。"
    };
  }
  return null;
});
const getStatusColor = s =>
  s === "已確認"
    ? "green"
    : s === "已入住"
    ? "blue"
    : s === "已取消"
    ? "red"
    : "grey";

const statusDialog = reactive({
  show: false,
  status: "",
  reason: "",
  target: null
});
const openStatusDialog = booking => {
  statusDialog.target = booking;
  statusDialog.status = booking.status;
  statusDialog.reason = "";
  statusDialog.show = true;
};
const confirmStatusChange = () => {
  if (statusDialog.target) {
    statusDialog.target.status = statusDialog.status;
    addNotification(
      "訂單狀態更新",
      `訂單 ${statusDialog.target.id} 狀態已變更為 ${statusDialog.target.status}。備註: ${statusDialog.reason}`,
      "edit",
      "orange"
    );
  }
  statusDialog.show = false;
};
const cancelOrder = booking => {
  $q.dialog({
    title: "取消訂單",
    message: "確定要取消此訂單嗎？",
    cancel: true,
    persistent: true
  }).onOk(() => {
    booking.status = "已取消";
    addNotification(
      "訂單取消",
      `訂單 ${booking.id} 已被取消。`,
      "cancel",
      "red"
    );
  });
};

const maskName = name => {
  if (!name) return "";
  if (name.length === 2) return name[0] + "*";
  if (name.length >= 3)
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  return name;
};

const formatCurrency = val => {
  if (!val && val !== 0) return "";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>
