<template>
  <div>
    <div class="text-h5 q-mb-md">訂單查詢</div>

    <!-- 查詢條件區 -->
    <q-card class="q-mb-md q-pa-md bg-grey-1" flat>
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="orderQuery.dateRange"
            label="查詢區間 (預設近3個月)"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="orderQuery.dateRange"
                    range
                    mask="YYYY/MM/DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-3">
          <q-select
            outlined
            v-model="orderQuery.status"
            :options="['全部', '已完成', '已取消', '待入住']"
            label="訂單狀態"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-btn
            color="primary"
            label="查詢"
            icon="search"
            class="full-width"
            @click="searchOrders"
          ></q-btn>
        </div>
      </div>
    </q-card>

    <q-table
      :rows="orderList"
      :columns="orderColumns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <span v-if="userRole === 'dev'">$****</span>
          <span v-else>{{ formatCurrency(props.value) }}</span>
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
</template>

<script setup>
import { ref, reactive } from "vue";

const orderQuery = reactive({
  dateRange: { from: "2023/10/01", to: "2024/01/01" },
  status: "全部"
});
const orderList = ref([
  {
    id: "O20231001",
    date: "2023-10-01",
    name: "王小明",
    phone: "0912345678",
    amount: 3000,
    status: "已完成"
  },
  {
    id: "O20231115",
    date: "2023-11-15",
    name: "陳大文",
    phone: "0987654321",
    amount: 5000,
    status: "已取消"
  }
]);
const orderColumns = [
  { name: "id", label: "單號", field: "id", align: "left" },
  { name: "date", label: "日期", field: "date", align: "left" },
  { name: "name", label: "訂購人", field: "name", align: "left" },
  { name: "phone", label: "電話", field: "phone", align: "left" },
  { name: "amount", label: "金額", field: "amount", align: "right" },
  { name: "status", label: "狀態", field: "status", align: "center" }
];
const searchOrders = () => {
  $q.loading.show();
  setTimeout(() => $q.loading.hide(), 500);
};

const formatCurrency = val => {
  if (!val && val !== 0) return "";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>
