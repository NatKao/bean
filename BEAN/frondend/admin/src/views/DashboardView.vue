<template>
  <div>
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-sm">近期訂單 (近兩週)</div>
        <q-table 
          :rows="recentOrders" 
          :columns="recentOrderColumns" 
          row-key="id" 
          flat 
          hide-bottom
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.value)"
                text-color="white"
                size="sm"
                dense
              >{{ props.value }}</q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-notes="props">
            <q-td :props="props" style="max-width: 200px">
              <div class="ellipsis">
                {{ props.value }}
                <q-tooltip
                  v-if="props.value && props.value !== '無'"
                  anchor="top middle"
                  self="bottom middle"
                  max-width="300px"
                  class="bg-grey-9 text-body2"
                >
                  {{ props.value }}
                </q-tooltip>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      
      <div class="col-12 col-md-4">
        <q-card class="my-card full-height">
          <q-card-section>
            <div class="text-subtitle2 text-grey">本週累積瀏覽人數</div>
            <div class="row items-baseline q-mt-md">
              <div class="text-h3 text-primary q-mr-md">12,450</div>
              <div class="text-subtitle1 text-positive">
                <q-icon name="arrow_upward"></q-icon> 15%
              </div>
            </div>
            <div class="text-caption text-grey q-mt-sm">
              上週總人數: 10,820
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="my-card full-height">
          <q-card-section>
            <div class="text-subtitle2 text-grey q-mb-sm">裝置瀏覽分佈</div>
            <div class="row items-center justify-around q-mt-md">
              <div class="text-center">
                <q-icon name="smartphone" size="md" color="primary"></q-icon>
                <div class="text-h6 text-weight-bold q-mt-xs">60%</div>
                <div class="text-caption text-grey-6">手機</div>
              </div>
              <div class="text-center">
                <q-icon name="tablet_mac" size="md" color="orange"></q-icon>
                <div class="text-h6 text-weight-bold q-mt-xs">10%</div>
                <div class="text-caption text-grey-6">平板</div>
              </div>
              <div class="text-center">
                <q-icon name="computer" size="md" color="secondary"></q-icon>
                <div class="text-h6 text-weight-bold q-mt-xs">30%</div>
                <div class="text-caption text-grey-6">電腦</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="my-card full-height bg-indigo-1">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-indigo-9">統計摘要</div>
              <q-chip color="indigo" text-color="white" icon="analytics" size="sm">週報表</q-chip>
            </div>
            
            <div class="column q-gutter-y-sm">
              
              <div class="row items-center justify-between">
                <div class="text-caption text-grey-8">單日最高</div>
                <div class="text-h5 text-weight-bold text-indigo">2,500</div>
              </div>
              <q-separator color="indigo-2" />

              <div class="row items-center justify-between">
                <div class="text-caption text-grey-8">平均每日</div>
                <div class="text-h5 text-weight-bold text-indigo">1,850</div>
              </div>
              <q-separator color="indigo-2" />

              <div class="row items-center justify-between">
                <div class="text-caption text-grey-8">本週總計</div>
                <div class="text-h5 text-weight-bold text-indigo">12,950</div>
              </div>

            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const recentOrders = ref([
  { id: "O20231201", guest: "王小明", date: "2023-12-01", pax: "2大", notes: "無", status: "已入住" },
  { id: "O20231202", guest: "李小華", date: "2023-12-02", pax: "2大1小", notes: "需要嬰兒床、澡盆，盡量安排高樓層", status: "已確認" },
  { id: "O20231203", guest: "陳大文", date: "2023-12-03", pax: "4大", notes: "無", status: "已退房" },
  { id: "O20231204", guest: "張三", date: "2023-12-04", pax: "1大", notes: "延後入住", status: "待入住" },
  { id: "O20231205", guest: "林志玲", date: "2023-12-05", pax: "2大", notes: "取消原因：行程變更", status: "已取消" }
]);

const recentOrderColumns = [
  { name: "id", label: "訂單編號", field: "id", align: "left" },
  { name: "guest", label: "訂房人", field: "guest", align: "left" },
  { name: "date", label: "入住日期", field: "date", align: "left" },
  { name: "pax", label: "人數", field: "pax", align: "left" },
  { name: "notes", label: "備註", field: "notes", align: "left", style: "max-width: 200px" },
  { name: "status", label: "狀態", field: "status", align: "center" }
];

const getStatusColor = s => {
  if (s === "已確認") return "green";
  if (s === "已入住") return "blue";
  if (s === "已取消") return "red";
  return "grey";
};
</script>