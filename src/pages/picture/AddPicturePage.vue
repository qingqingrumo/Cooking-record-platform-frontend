<template>
  <div id="addPicturePage">
    <h2 class="page-title">
      {{ route.query.id ? 'Edit Menu Record' : 'Create Menu Record' }}
    </h2>
    <div class="editor-grid">
      <div class="preview-pane frosted">
        <div class="pane-title">Menu photo</div>
        <PictureUpload :picture="picture" :onSuccess="onSuccess" />
      </div>
      <div class="form-pane frosted">
        <div class="pane-title">Details</div>
        <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
          <a-form-item label="Dish name" name="name">
            <a-input v-model:value="pictureForm.name" placeholder="Enter dish name" />
          </a-form-item>
          <a-form-item label="Notes" name="introduction">
            <a-textarea v-model:value="pictureForm.introduction" placeholder="Add cooking notes or description"
              :autoSize="{ minRows: 5, maxRows: 5 }" allowClear />
          </a-form-item>
          <a-form-item label="Cuisine" name="category">
            <a-auto-complete v-model:value="pictureForm.category" :options="categoryOptions" placeholder="e.g. appetizer, main, dessert"
              allowClear />
          </a-form-item>
          <a-form-item label="Tips" name="tags">
            <a-select v-model:value="pictureForm.tags" :options="tagOptions" mode="tags" placeholder="e.g. spicy, vegan, quick"
              allowClear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" block>
              {{ route.query.id ? 'Update' : 'Create' }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { onMounted, reactive, ref } from 'vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'

const picture = ref<API.PictureVo>()
const pictureForm = reactive<API.PictureEditRequest>({})

const onSuccess = (newPicture: API.PictureVo) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

const router = useRouter()

/**
 * Submit form
 * @param values
 */
const handleSubmit = async (values: any) => {
  const pictureId = picture.value.id
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    if (route.query.id) {
      message.success('Updated successfully')
      router.back()
    } else {
      message.success('Created successfully')
      // todo jump to detail page
      router.push({
        path: `/picture/${pictureId}`,
      })
    }
  } else {
    if (route.query.id) {
      message.error('Update failed: ' + res.data.message + ' ' + res.data.description)
    } else {
      message.error('Create failed: ' + res.data.message + ' ' + res.data.description)
    }
  }
}

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

const route = useRoute()

// Fetch existing data when editing
const getOldPicture = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id: id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

onMounted(() => {
  getOldPicture()
  getTagCategoryOptions()
})

// Image crop modal ref
const imageCropperRef = ref()

// Open cropper
const doEditPicture = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openModal()
  }
}

// Crop success event
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}
</script>
<style scoped>
#addPicturePage {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 16px;
}

.editor-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 16px;
}

.preview-pane,
.form-pane {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--brand-border);
  background: rgba(255, 255, 255, 0.02);
}

.pane-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--brand-text);
}

@media (max-width: 900px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
