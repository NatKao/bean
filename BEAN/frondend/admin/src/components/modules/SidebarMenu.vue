<template>
  <q-list separator class="text-grey-9">
    <template v-for="menus in props.menu" :key="menus.id">
      <template v-if="checkRole(menus)">
        <SidebarItem
          v-if="!menus.subMenu"
          :name="menus.name"
          :url="menus.url"
          :icon="menus.icon"
          :icon-type="menus.iconType"
          :real-u-r-l="menus.realURL"
          :direct="menus.direct"
          @refresh="refresh"
        ></SidebarItem>
        <SidebarExpansionItem
          v-else
          :menu="menus"
          :inset-level="1"
          :is-collapse="props.isCollapse"
          :is-public="props.isPublic"
          :dataCount="dataCount"
          :userReviewDataCount="userReviewDataCount"
          :outboundVerifyCont="outboundVerifyCont"
          @refresh="refresh"
        ></SidebarExpansionItem>
      </template>
    </template>
  </q-list>
</template>

<script setup>
import { auth } from "@/stores/Auth";
import { useRoute } from "vue-router";
import navAuth from "@/views/js/navAuth.js";
import SidebarItem from "@/components/modules/SidebarItem.vue";
import SidebarExpansionItem from "@/components/modules/SidebarExpansionItem.vue";

const props = defineProps({
  menu: {
    type: Array,
    required: true
  },
  isCollapse: {
    type: Boolean,
    default: false
  },
  dataCount: {
    type: Number,
    default: 0
  },
  userReviewDataCount: {
    type: Number,
    default: 0
  },
  outboundVerifyCont: {
    type: Number,
    default: 0
  }
});

const authStore = auth();
const userLvl = authStore.user_level;

/**
 *檢查腳色權限
 * @param {object} menu 目錄資料
 * @returns {boolean} 是否顯示
 */
const checkRole = menu => {
  if (menu.hidden || menu.display === false) {
    return false;
  }

  //lvl 不存在
  const flag = menu.hidden !== true && menu.display !== false;
  //Menu
  if (!menu.subMenu && navAuth[menu.id]) {
    return navAuth[menu.id].includes(userLvl) ? flag : false;
  }
  //subMenu
  let menuAuth = false;
  menu.subMenu.forEach(item => {
    if (navAuth[item.id] && navAuth[item.id].includes(userLvl)) {
      menuAuth = true;
    } else {
      item.display = false;
    }
  });
  return menuAuth ? flag : false;

  //角色 不存在
  const roles = menu.roles;
  if (!roles) {
    return flag;
  }

  if (authStore.Roles && authStore.Roles.length > 0) {
    if (roles.length == 1 && roles[0] === "ALL_ROLE") {
      // 有角色，且ALL_ROLE
      return true;
    }

    let checked = false;
    authStore.Roles.every(uRole => {
      if (checked) {
        return false;
      }

      roles.every(mRole => {
        if (uRole == mRole) {
          checked = true;
          return false;
        }
        return true;
      });
      return true;
    });

    return checked;
  }

  // 未登入下，如有角色控制則返回false
  return false;
};

const emit = defineEmits(["reload-router-view"]);
const $route = useRoute();
/**
 *轉址
 * @param {string} toUrl 位址
 */
const refresh = toUrl => {
  if (toUrl == $route.path) {
    emit("reload-router-view");
  } else if ($route.name == "error") {
    emit("reload-router-view");
  }
};
</script>
