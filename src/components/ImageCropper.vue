<template>
  <a-modal
    class="image-cropper"
    v-model:visible="visible"
    title="Edit image"
    :footer="false"
    @cancel="closeModal"
  >
    <vue-cropper
      ref="cropperRef"
      :img="imageUrl"
      :autoCrop="true"
      :fixedBox="false"
      :centerBox="true"
      :canMoveBox="true"
      :info="true"
      outputType="png"
    />
    <div style="margin-bottom: 16px" />
    <!-- Image actions -->
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft">Rotate left</a-button>
        <a-button @click="rotateRight">Rotate right</a-button>
        <a-button @click="changeScale(1)">Zoom in</a-button>
        <a-button @click="changeScale(-1)">Zoom out</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm">Confirm</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVo) => void
}

const props = defineProps<Props>()

// Cropper ref
const cropperRef = ref()

// Rotate left
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}

// Rotate right
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

// Scale
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
}

const loading = ref<boolean>(false)

// Confirm crop
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
    // Upload image
    handleUpload({ file })
  })
}

/**
 * Upload
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
    // console.log(params)
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('Upload succeeded')
      // pass new picture to parent
      props.onSuccess?.(res.data.data)
      closeModal();
    } else {
      message.error('Upload failed: ' + res.data.message + ' ' + res.data.description)
    }
  } catch (error) {
    message.error('Upload failed')
  } finally {
    loading.value = false
  }
}


// Visibility
const visible = ref(false)

// Open modal
const openModal = () => {
  visible.value = true
}

// // Close modal
// const closeModal = () => {
//   visible.value = false
// }

// Expose to parent
defineExpose({
  openModal,
})

// Close modal
const closeModal = () => {
  visible.value = false
}






</script>

<style scoped>
.image-cropper {
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px;
}
</style>
