<template>
  <div class="picture-list" style="margin-top: 10px">
    <!--    <button @click="new">Debug: pass data</button>-->
    <!-- Menu list -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <ShareModal ref="shareModalRef" :link="shareLink" />
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- Single menu record -->
          <a-card hoverable @click="doClickPicture(picture)" class="card">
            <template #cover>
              <div class="cover-wrap">
                <img
                  class="cover-img"
                  :alt="picture.name"
                  :src="picture.thumbnailUrl ?? picture.url"
                  loading="lazy"
                />
                <div class="cover-title">
                  <span class="title-text">{{ picture.name }}</span>
                </div>
              </div>
            </template>
            <template v-if="showOp" #actions>
              <a-space @click="(e) => doSearch(picture, e)">
                <SearchOutlined />
              </a-space>
              <a-space @click="(e) => doShare(picture, e)">
                <ShareAltOutlined />
              </a-space>
              <a-space
                v-if="canEdit"
                @click="(e) => doEdit(picture, e)">
                <EditOutlined />
              </a-space>
              <a-space
                v-if="canDelete"
                @click="(e) => doDelete(picture, e)">
                <DeleteOutlined />
              </a-space>
              <a-space @click="(e) => doCheck(picture, e)">
                <a-checkbox
                  v-model:checked="picture.checked"
                  @change="doChange(picture)"
                ></a-checkbox>
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <DeleteConfirmModal ref="deleteConfirmModalRef" :on-success="onDeleteConfirmSuccess" :obj="deletePicture"/>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'
import { ref } from 'vue'
import BatchDeletePictureModal from '@/components/BatchDeletePictureModal.vue'
import DeletePictureModal from '@/components/DeleteConfirmModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

// Go to detail
const router = useRouter()
const doClickPicture = (picture) => {
  // console.log(picture)
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// Edit
const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: '/picture/addPicture',
    query: {
      id: picture.id,
    },
  })
}

// Search
const doSearch = (picture, e) => {
  e.stopPropagation()
  window.open(`/picture/searchPicture?pictureId=${picture.id}`)
}

// Share modal ref
const shareModalRef = ref()
// Share link
const shareLink = ref<string>()

// Share
const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}

// Checkbox area
const doCheck = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
}

const newPicture = ref()

const doChange = (picture: API.PictureVO[]) => {
  if (picture.checked) {
    newPicture.value = JSON.parse(JSON.stringify(picture))
    newPicture.value.checked = true
    emit('newPicture', newPicture.value)
  } else {
    newPicture.value = JSON.parse(JSON.stringify(picture))
    newPicture.value.checked = false
    emit('newPicture', newPicture.value)
  }
}
// Emits
const emit = defineEmits<{
  (e: 'newPicture', newPicture: API.PictureVO[]): void,
}>()

// Delete confirm modal
const deleteConfirmModalRef = ref()
const deletePicture = ref();

// Refresh data after batch delete
const onDeleteConfirmSuccess = () => {
  deletePicture.value = '';
  // Ask parent to reload
  props?.onReload()
}

// Open delete confirm
const doDelete = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  deletePicture.value = picture;
  if (deleteConfirmModalRef.value) {
    deleteConfirmModalRef.value.openModal()
  }
}

</script>

<style scoped>
.picture-list {
  margin-top: 10px;
}

:deep(.ant-list-items) {
  gap: 14px;
}

:deep(.ant-list .ant-list-item) {
  background: transparent;
}

.card {
  overflow: hidden;
}

.cover-wrap {
  position: relative;
  height: 180px;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 80%);
  display: flex;
  align-items: flex-end;
  min-height: 46px;
}

.title-text {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
}
</style>
