<template>
  <q-expansion-item
    :group="`${insetLevel}-Group`"
    active-class="cl-menu-active"
    header-class="cl-menu-title"
  >
    <template #header>
      <q-item-section v-if="props.menu.icon" avatar>
        <div>
          <font-awesome-icon :icon="[props.menu.iconType, props.menu.icon]" />
        </div>
      </q-item-section>
      <q-item-section>
        {{ props.menu.name }}
      </q-item-section>
    </template>
    <template v-for="subMenus in props.menu.subMenu" :key="subMenus">
      <template v-if="checkRole(subMenus) && checkLvls(subMenus)">
        <sidebar-item
          v-if="!subMenus.subMenu && subMenus.display"
          :name="getName(subMenus)"
          :url="subMenus.url"
          :real-u-r-l="subMenus.realURL"
          :class="subMenus.class"
          @refresh="refresh"
        ></sidebar-item>
        <!-- 第N層遞迴 -->
        <sidebar-expansion-item
          v-else
          :menu="subMenus"
          :inset-level="insetLevel + 1"
          :is-collapse="props.isCollapse"
          :is-public="props.isPublic"
          @refresh="refresh"
        ></sidebar-expansion-item>
      </template>
    </template>
  </q-expansion-item>
</template>
<script setup>
import SidebarItem from "@/components/modules/SidebarItem.vue";
import { auth } from "@/stores/Auth";

const props = defineProps({
  menu: {
    type: Object,
    required: true
  },
  insetLevel: {
    type: Number,
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

const emit = defineEmits(["refresh"]);
/**
 *轉址
 * @param {string} toUrl 位址
 */
const refresh = toUrl => {
  emit("refresh", toUrl);
};

const authStore = auth();

/**
 *設定目錄名稱
 * @param {object} subMenus 目錄元件
 * @returns {string} 目錄樣式
 */
const getName = subMenus => {
  if (subMenus.id == "UserData") {
    return subMenus.name + "(" + props.dataCount + ")";
  }
  if (subMenus.id == "UserReview") {
    return subMenus.name + "(" + props.userReviewDataCount + ")";
  }
  if (subMenus.id == "OutboundVerify") {
    return subMenus.name + "(" + props.outboundVerifyCont + ")";
  }
  return subMenus.name;
};

/**
 *檢查目錄角色控制
 * @param {object} menu 目錄元件
 * @returns {boolean} 未登入下，如有角色控制則返回false
 */
const checkRole = menu => {
  const roles = menu.roles;
  if (!roles) {
    return menu.hidden !== true && menu.display !== false;
  }

  // if (authStore.Roles && authStore.Roles.length > 0) {
  //   if (roles.length == 1 && roles[0] === "ALL_ROLE") {
  //     // 有角色，且ALL_ROLE
  //     return true;
  //   }

  //   let checked = false;
  //   authStore.Roles.every(uRole => {
  //     if (checked) {
  //       return false;
  //     }

  //     roles.every(mRole => {
  //       if (uRole == mRole) {
  //         checked = true;
  //         return false;
  //       }
  //       return true;
  //     });
  //     return true;
  //   });

  //   return checked;
  // }
  // 未登入下，如有角色控制則返回false
  return false;
};

/**
 *檢查目錄level控制
 * @param {object} menu 目錄元件
 * @returns {boolean} 未登入下，如有角色控制則返回false
 */
const checkLvls = menu => {
  const lvls = menu.levels;
  if (!lvls) {
    return menu.hidden !== true && menu.display !== false;
  }
  const uLvls = authStore.user_level;
  if (uLvls) {
    let checked = false;
    if (checked) {
      return false;
    }
    lvls.every(mLvl => {
      if (uLvls == mLvl) {
        checked = true;
        return false;
      }
      return true;
    });
    return checked;
  }
  // 未登入下，如有角色控制則返回false
  return false;
};
</script>
