<template>
  <div id="addPictureBatchPage">
    <h2 style="margin-bottom: 16px">Batch create menus</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="Keyword" name="searchText">
        <a-input v-model:value="formData.searchText" placeholder="Enter keyword" />
      </a-form-item>
      <a-form-item label="Fetch count" name="count">
        <a-input-number
          v-model:value="formData.count"
          placeholder="Enter count"
          style="min-width: 180px"
          :min="1"
          :max="30"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="Name prefix" name="namePrefix">
        <a-input v-model:value="formData.namePrefix" placeholder="Enter name prefix, auto-numbered" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          Run task
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { uploadPictureByBatchUsingPost } from '@/api/pictureController'

const formData = reactive<API.PictureUploadByBatchRequest>({
  count: 10,
})
const loading = ref(false)

const handleSubmit = async (values: any) => {
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success(`Created successfully, total ${res.data.data}`)
    router.push({
      path: '/',
    })
  } else {
    message.error('Create failed: ' + res.data.message + ' ' + res.data.description)
  }
  loading.value = false
}
</script>
<style scoped>
#addPictureBatchPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
