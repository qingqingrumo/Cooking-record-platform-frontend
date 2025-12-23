<template>
  <div id="app" class="app-shell">
    <div class="floating-orb orb-1"></div>
    <div class="floating-orb orb-2"></div>
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/user'

// const loginUserStore = useLoginUserStore()
// loginUserStore.fetchLoginUser()
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.app-shell::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 30%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02), transparent 30%);
  pointer-events: none;
}
</style>

