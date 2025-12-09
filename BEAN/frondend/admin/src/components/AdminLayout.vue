<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>

        <q-toolbar-title>
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="後台管理" icon="home"></q-breadcrumbs-el>
            <q-breadcrumbs-el
              :label="route.meta.title || '總覽'"
            ></q-breadcrumbs-el>
          </q-breadcrumbs>
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-chip
            v-if="adminStore.currentRole === 'dev'"
            color="red"
            text-color="white"
            icon="bug_report"
            >開發者模式</q-chip
          >
          <q-chip
            v-if="adminStore.currentRole === 'viewer'"
            color="orange"
            text-color="white"
            icon="visibility"
            >檢閱者模式</q-chip
          >

          <!-- 新增: 通知鈴鐺 -->
          <q-btn round dense flat icon="notifications" class="q-mr-sm">
            <!-- 紅點: 當有未讀訊息時顯示 -->
            <q-badge
              v-if="unreadCount > 0"
              color="red"
              floating
              rounded
              style="width: 10px; height: 10px; padding: 0"
            ></q-badge>

            <q-menu>
              <q-list style="min-width: 350px; max-width: 400px">
                <q-item-label header class="text-h6">通知中心</q-item-label>

                <div v-if="notifications.length > 0">
                  <q-item
                    v-for="n in notifications"
                    :key="n.id"
                    clickable
                    v-ripple
                    :class="{ 'bg-blue-1': !n.read }"
                  >
                    <q-item-section avatar>
                      <q-avatar
                        :icon="n.icon"
                        :color="n.color"
                        text-color="white"
                        size="md"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ n.title }}</q-item-label>
                      <q-item-label caption lines="2">{{
                        n.message
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-item-label caption>{{ n.time }}</q-item-label>
                      <q-icon
                        v-if="!n.read"
                        name="fiber_manual_record"
                        color="primary"
                        size="xs"
                      ></q-icon>
                    </q-item-section>
                  </q-item>
                </div>
                <div v-else class="q-pa-md text-center text-grey">
                  暫無通知
                </div>

                <q-separator></q-separator>

                <!-- 全部已讀按鍵 -->
                <q-item
                  clickable
                  v-ripple
                  @click="markAllRead"
                  class="text-center text-primary q-py-md"
                >
                  <q-item-section>全部已讀</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn-dropdown flat :label="adminStore.adminInfo.name" icon="person">
            <q-list>
              <q-item-label header>模擬切換權限</q-item-label>
              <q-item
                clickable
                v-close-popup
                @click="adminStore.switchRole('admin')"
              >
                <q-item-section>切換為 Admin</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="adminStore.switchRole('dev')"
              >
                <q-item-section>切換為 Developer</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="adminStore.switchRole('viewer')"
              >
                <q-item-section>切換為 Viewer</q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section class="text-negative">登出</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="250"
      bordered
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(item, index) in menuList">
            <q-separator v-if="item.separator" :key="index" />

            <q-expansion-item
              v-else-if="item.children"
              :icon="item.icon"
              :label="item.label"
              header-class="text-grey-8"
              :key="'eitem' + index"
              >'
              <q-list class="bg-grey-2">
                <q-item
                  v-for="sub in item.children"
                  :key="sub.id"
                  clickable
                  v-ripple
                  :to="sub.to"
                  active-class="text-primary"
                  class="q-pl-lg"
                >
                  <q-item-section avatar
                    ><q-icon :name="sub.icon" size="xs"></q-icon
                  ></q-item-section>
                  <q-item-section>{{ sub.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-item
              v-else
              clickable
              v-ripple
              :to="item.to"
              active-class="text-primary bg-blue-1"
              class="text-grey-8"
              :key="'item' + index"
            >
              <q-item-section avatar
                ><q-icon :name="item.icon"></q-icon
              ></q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md">
        <router-view></router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAdminStore } from "@/stores/AdminAuth";
import { useQuasar } from "quasar";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const drawer = ref(true);

// 登出邏輯
const handleLogout = () => {
  $q.dialog({
    title: "登出",
    message: "確定要登出系統嗎？",
    cancel: true,
    persistent: true
  }).onOk(() => {
    adminStore.logout();
    router.push("/login");
    $q.notify({ message: "已登出", color: "primary", icon: "logout" });
  });
};

// 選單設定：注意這裡改用了 `to` 屬性來對應 Router 路徑
const menuList = [
  { label: "總覽", icon: "dashboard", to: "/admin/dashboard" },
  { separator: true },
  { label: "首頁設定", icon: "home", to: "/admin/home-setting" },
  { label: "介紹設定", icon: "info", to: "/admin/intro-setting" },
  {
    label: "訂房須知",
    icon: "notifications_active",
    to: "/admin/notice-setting"
  },
  { label: "地理位置", icon: "place", to: "/admin/location-setting" },
  { separator: true },
  { label: "前端頁面控制", icon: "view_quilt", to: "/admin/frontend-control" },
  { label: "異動訂單查詢", icon: "date_range", to: "/admin/order-query" },
  { label: "會員/訂房查詢", icon: "people", to: "/admin/member-query" },
  { label: "預覽評價", icon: "rate_review", to: "/admin/reviews" },
  { separator: true },
  { label: "報表產生", icon: "assessment", to: "/admin/reports" },
  {
    label: "其他設定",
    icon: "settings",
    children: [
      { label: "社群設定", icon: "share", to: "/admin/social-setting" },
      { label: "參數設定", icon: "tune", to: "/admin/params-setting" }
    ]
  }
];


const notifications = ref([
  {
    id: 1,
    title: "新訂單",
    message: "王小明 預訂了雙人房 (2023-12-01)",
    time: "10分鐘前",
    read: false,
    icon: "bookmark_add",
    color: "green"
  },
  {
    id: 2,
    title: "訂單取消",
    message: "林志玲 取消了訂單 (O20231205)",
    time: "1小時前",
    read: false,
    icon: "bookmark_remove",
    color: "red"
  }
]);

const unreadCount = computed(
  () => notifications.value.filter(n => !n.read).length
);

const addNotification = (
  title,
  message,
  icon = "notifications",
  color = "primary"
) => {
  if (userRole.value === "dev") return;
  notifications.value.unshift({
    id: Date.now(),
    title,
    message,
    time: "剛剛",
    read: false,
    icon,
    color
  });
};

const markAllRead = () => {
  notifications.value.forEach(n => (n.read = true));
};
</script>
