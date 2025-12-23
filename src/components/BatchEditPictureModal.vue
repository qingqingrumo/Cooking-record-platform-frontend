<template>
  <a-modal v-model:visible="visible" title="Batch Edit Pictures" :footer="false" @cancel="closeModal">
    <a-typography-paragraph type="secondary">* Only applies to pictures on current page</a-typography-paragraph>
    <!-- Form -->
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="Category" name="category">
        <a-auto-complete
          v-model:value="formData.category"
          :options="categoryOptions"
          placeholder="Enter category"
          allowClear
        />
      </a-form-item>
      <a-form-item label="Tags" name="tags">
        <a-select
          v-model:value="formData.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="Enter tags"
          allowClear
        />
      </a-form-item>
      <a-form-item label="Naming rule" name="nameRule">
        <a-input v-model:value="formData.nameRule" placeholder="Enter naming rule, use {index} to auto-generate" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults, defineExpose, reactive, onMounted } from 'vue'
import {
  editPictureByBatchUsingPost,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
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

// Form data
const formData = reactive({
  category: '', // category
  tags: [], // tags
  nameRule: '', // naming
})

const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

// Fetch tag and category options
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // map to select options
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('Failed to load options: ' + res.data.message + ' ' + res.data.description)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

// Submit handler
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    return
  }
  const res = await editPictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('Updated successfully')
    closeModal()
    props.onSuccess?.()
  } else {
    message.error('Update failed: ' + res.data.message + ' ' + res.data.description)
  }
}



</script>
