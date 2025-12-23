<template>
  <a-modal v-model:visible="visible" title="Share" :footer="false" @cancel="closeModal">
    <h4>Copy share link</h4>
    <a-typography-link copyable>
      <!-- todo Build a public share page; otherwise no permission -->
      {{ link }}
    </a-typography-link>
    <div style="margin-bottom: 16px" />
    <h4>Scan on mobile</h4>
    <a-qrcode :value="link" />
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults } from 'vue'

/**
 * Props definition
 */
interface Props {
  title: string
  link: string
}

/**
 * Default props
 */
const props = withDefaults(defineProps<Props>(), {
  title: () => 'Share',
  link: () => 'https://laoyujianli.com/share/yupi',
})

// Visibility
const visible = ref(false)

// Open modal
const openModal = () => {
  visible.value = true
}

// Close modal
const closeModal = () => {
  visible.value = false
}

import { defineExpose } from 'vue'

// Expose to parent
defineExpose({
  openModal,
})
</script>
