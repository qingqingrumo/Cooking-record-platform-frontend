<template>
  <div id="basicLayout">
    <a-layout class="layout-shell" style="min-height: 100vh">
      <a-layout-header class="header glass-strong">
        <div class="layout-container header-inner">
          <GlobalHeader />
        </div>
      </a-layout-header>
      <a-layout class="layout-container body">
        <a-layout-content class="content">
          <div class="content-inner frosted">
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import { useLoginUserStore } from '@/stores/user'

const loginUserStore = useLoginUserStore()
</script>
<style scoped>
#basicLayout .header {
  border-bottom: 1px solid var(--brand-border);
  padding-inline: 0;
  margin-bottom: 16px;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 22px;
}

#basicLayout .content {
  padding: 0;
  width: 100%;
}

#basicLayout .content-inner {
  padding: 28px;
  margin-bottom: 40px;
  border-radius: 24px;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}
</style>
