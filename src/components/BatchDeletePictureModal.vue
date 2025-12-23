<template>
  <a-modal v-model:visible="visible" title="Delete Pictures" :footer="false" @cancel="closeModal">
    <a-typography-paragraph type="secondary">* Only applies to pictures on current page</a-typography-paragraph>
    <!-- Confirm buttons -->
    <a-button type="primary" @click="handleSubmit" danger>Confirm Delete</a-button>
    <a-button type="primary" @click="closeModal">Cancel</a-button>
  </a-modal>
</template>

<script setup lang="ts">
import { defineExpose, defineProps, ref, withDefaults } from 'vue'
import { deletePictureByBatchUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

// Props
interface Props {
  pictureList: API.PictureVO[]
  onSuccess: () => void
}

// Defaults
const props = withDefaults(defineProps<Props>(), {})

// Modal visibility
const visible = ref(false)

// Open modal
const openModal = () => {
  visible.value = true
}

// Close modal
const closeModal = () => {
  visible.value = false
}

// Expose to parent
defineExpose({
  openModal,
})

// Submit handler
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    return
  }
  const res = await deletePictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('Deleted successfully')
    closeModal()
    props.onSuccess?.()
  } else {
    message.error('Delete failed: ' + res.data.message + ' ' + res.data.description)
  }
}
</script>
