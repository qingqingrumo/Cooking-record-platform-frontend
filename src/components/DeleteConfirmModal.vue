<template>
  <a-modal v-model:visible="visible" title="Confirm Delete" :footer="false" @cancel="closeModal">
    <!-- Confirm buttons -->
    <a-button type="primary" @click="doDelete" danger>Delete</a-button>
    <a-button type="primary" @click="closeModal">Cancel</a-button>
  </a-modal>
</template>

<script setup lang="ts">
import { defineExpose, defineProps, ref, withDefaults } from 'vue'
import { deletePictureByBatchUsingPost, deletePictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

// Props
interface Props {
  obj: any
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

const doDelete = async () => {
  const id = props.obj.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('Deleted')
    closeModal()
    props.onSuccess?.()
  } else {
    message.error('Delete failed')
  }
}
</script>
