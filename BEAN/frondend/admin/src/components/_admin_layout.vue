<template>
  <q-layout view="hHh LpR fFf">
    <!-- 上方導覽列 -->
    <q-header elevated style="width: 300px;">
      <div class="cl-header">
        <div class="cl-logo">
          <font-awesome-icon
            :icon="['fas', 'list']"
            class="cl-fa-info"
          />
          OO系統
          <!-- <img alt="Logo" src="@/assets/images/logo.png" /> -->
        </div>
        <div class="cl-header-group cl-header-right">
          <q-btn flat  class="cl-header-grid cl-header-btn">
            <q-avatar>
              <img alt="avatar" src="@/assets/images/avatar.jpg" />
            </q-avatar>
            <q-menu
              transition-show="jump-down"
              transition-hide="jump-up"
              anchor="top right" self="top left"
            >
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>Having fun</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-header>

    <!-- 左側導覽列 -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      show-if-above
      class="cl-menu fz-16"
      :breakpoint="0"
      :width="300"
      bordered
    >
      <sidebar-menu
        :menu="nav.menu"
        :is-public="true"
        :dataCount="dataCount"
        :userReviewDataCount="userReviewDataCount"
        :outboundVerifyCont="outboundVerifyCont"
        @reload-router-view="routerReload"
      />
    </q-drawer>

    <q-page-container style="padding-top: 0px;">
      <div style="background-color: #f9fafb">
        <router-view
          v-if="isRouterAlive"
        />
      </div>
    </q-page-container>

    <!-- <water-maker
      :show="true"
      :default-display="true"
      :input-text="authStore.AccessNo"
    ></water-maker> -->

    <!-- go-top功能, 一定要放在q-layout的最後一個元件才能保持懸浮在最上方 -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="200"
      :offset="[50, 40]"
      style="z-index: 999;"
    >
      <!-- <q-btn fab glossy type="button" icon="arrow_upward" color="green-6" /> -->
    </q-page-scroller>
  </q-layout>
</template>
<script setup>
import { ref, onBeforeMount, nextTick, onMounted, inject } from "vue";
import { navCollection } from "@/stores/NavCollection";
import SidebarMenu from "@/components/modules/SidebarMenu.vue";
// import TopHeaderBar from "@/components/common/TopHeaderBar.vue";
import navCollectionService from "@/service/NavCollection";
import { useRoute } from "vue-router";
// import WaterMaker from "@/components/common/WaterMaker.vue";
import { auth } from "@/stores/Auth";

const authStore = auth();

const leftDrawerOpen = ref(true);
const nav = ref({});
const dataCount = ref(0);
const userReviewDataCount = ref(0);
const outboundVerifyCont = ref(0);
onBeforeMount(() => {
  const navCollectionStore = navCollection();
  navCollectionStore.setNav(navCollectionService);
  nav.value = navCollectionStore.nav;
});

const isRouterAlive = ref(true);
/**
 *是否顯示router view
 */
const routerReload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

const route = useRoute();
const tagname = ref(route.hash);

/**
 * 設定scroll位置
 * @param {string} hashname 名稱
 */
const jump = hashname => {
  const id = hashname.substring(1);
  const linkScroll = document.getElementById(id).offsetTop;
  document.body.scrollTop = linkScroll - 43;
};

onMounted(() => {
  if (tagname.value) {
    jump(tagname.value);
  }
});


</script>

<style lang="scss" scoped>
.cl-fa-info {
  width: 28px;
  height: 28px;
  margin-left: 8px;
  margin-right: 8px;
}
.cl-header {
  background-color: #00994e;
  display: flex;
  align-items: stretch;
  height: 50px;
}
.cl-header .cl-logo {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 700;
  /*padding: 0 24px;*/
  width: 240px;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
}
.cl-header .cl-logo img {
  margin-right: 12px;
}
.cl-header-group {
  display: flex;
  align-items: stretch;
}
.cl-header-group .cl-header-grid {
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
}
.cl-header-left {
  font-size: 18px;
}
.cl-header-left .cl-header-grid {
  border-right: 1px solid rgba(255, 255, 255, 0.5);
}
.cl-header-left .cl-header-grid:last-child {
  padding-right: 0;
  border-right: 0;
}
.cl-header-right {
  font-weight: 400;
  flex: 1;
  justify-content: flex-end;
}
.cl-header-right .cl-header-grid {
  border-left: 1px solid rgba(255, 255, 255, 0.5);
}
.cl-header-right .cl-header-grid:first-child {
  /*padding-left: 0;*/
  border-left: 0;
  position: relative;
}
.cl-header-btn {
  border-width: 0 0 0 1px;
  background-color: transparent;
  color: #ffffff;
  justify-content: space-between;
}
.cl-header-menu {
  border-radius: 0;
  padding: 17px 32px 27px 32px;
  background-color: #fafafa;
  max-height: 620px;
}
.cl-header-menu-grid {
  display: flex;
  padding: 13px 0;
  border-bottom: 1px solid #d8d8d8;
  color: #4a4a4a;
}
.cl-header-menu-grid:last-child {
  border-bottom: 0;
}
.cl-header-menu-grid .cl-ic-logout {
  margin-right: 15px;
}
.cl-header-menu-grid.q-pl-sm {
  padding-left: 8px;
}
.cl-header-menu-title {
  color: #111111;
  font-size: 18px;
}
.cl-header-menu-name {
  color: #00994e;
  text-decoration: underline;
}
.cl-header-menu-num {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: "Helvetica";
  line-height: 14px;
  color: #ffffff;
  background-color: #00994e;
  margin-left: 4px;
  border-radius: 99rem;
}
.cl-header-unread {
  position: absolute;
  right: 0px;
  top: 1px;
  width: 28px;
  height: 28px;
  border-radius: 99rem;
  font-size: 14px;
  background-color: #ff2828;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cl-body {
  background-color: #ffffff;
  padding: 32px;
  /*min-height: calc(100vh - 50px);*/
}
</style>