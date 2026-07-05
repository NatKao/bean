<template>
  <q-item
    v-if="props.realURL"
    v-ripple
    clickable
    active-class="menu-btn-active"
    :target="props.target"
    :href="props.url"
  >
    <q-item-section v-if="props.icon" avatar>
      <div style="font-size: 18px">
        <font-awesome-icon :icon="[props.iconType, props.icon]" />
      </div>
    </q-item-section>
    <q-item-section style="font-size: 16px" @click="refresh">
      {{ props.name }}
    </q-item-section>
  </q-item>

  <q-item
    v-else
    v-ripple
    clickable
    exact
    active-class="menu-btn-active"
    :to="props.url"
  >
    <q-item-section v-if="props.icon" avatar>
      <div style="font-size: 18px">
        <font-awesome-icon :icon="[props.iconType, props.icon]" />
      </div>
    </q-item-section>
    <q-item-section style="font-size: 16px" @click="refresh(url)">
      {{ props.name }}
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: ""
  },
  url: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  iconType: {
    type: String,
    default: ""
  },
  realURL: {
    type: Boolean,
    default: false
  },
  target: {
    type: String,
    default: "_blank"
  }
});

const emit = defineEmits(["refresh"]);
const refresh = toUrl => {
  emit("refresh", toUrl);
};
</script>

<style scoped>
.menu-btn-active {
  color: white;
  font-weight: 500;
  background: #4caf50;
  border-bottom: 2px solid #ffe41b;
}
</style>
