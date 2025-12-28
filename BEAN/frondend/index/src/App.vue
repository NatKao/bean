<template>
  <div id="app">
    <router-view />

    <Message />
  </div>
</template>

<script setup>
import Message from '@/components/common/Message.vue'
</script>