<template>
  <div class="pictureDetailPage">
    <a-row :gutter="[16, 16]">
      <!-- Menu preview -->
      <a-col :sm="24" :md="14" :xl="14">
        <a-card title="Menu Preview">
          <a-image class="preview-img" :src="picture.url" />
        </a-card>
      </a-col>
      <!-- Menu info -->
      <a-col :sm="24" :md="10" :xl="10">
        <a-card title="Menu Info">
          <a-descriptions :column="1" :label-style="{ width: '120px' }">
            <a-descriptions-item label="Author">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="Dish">
              {{ picture.name ?? 'Untitled dish' }}
            </a-descriptions-item>
            <a-descriptions-item label="Notes">
              <div class="notes-block">
                {{ picture.introduction ?? '-' }}
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="Ingredients">
              {{ picture.category ?? 'Ingredients' }}
            </a-descriptions-item>
            <a-descriptions-item label="Tips">
              <a-tag v-for="tag in picture.tags" :key="tag">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
          <a-space wrap>
            <a-button v-if="canEdit" type="primary" ghost @click="doEdit">
              Edit
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
            <a-button v-if="canDelete" danger @click="doDelete">
              Delete
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/user'
import router from '@/router'

const props = defineProps<{
  id: string | number
}>()
const picture = ref<API.PictureVo>({})

// Fetch picture details
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('Failed to get picture: ' + res.data.message + ' ' + res.data.description)
    }
  } catch (e: any) {
    message.error('Failed to get picture: ' + e.message)
  }
}

const loginUserStore = useLoginUserStore()
// Whether current user can edit
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  // not logged in
  if (!loginUser.id) {
    return false
  }
  // only owner or admin
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

// Whether current user can delete
const canDelete = computed(() => {
  const loginUser = loginUserStore.loginUser
  // not logged in
  if (!loginUser.id) {
    return false
  }
  // only owner or admin
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

// Edit
const doEdit = () => {
  router.push('/picture/addPicture?id=' + picture.value.id)
}
// Delete
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('Deleted')
    router.push('/')
  } else {
    message.error('Delete failed: ' + res.data.message + ' ' + res.data.description)
  }
}

onMounted(() => {
  fetchPictureDetail()
})

</script>
<style scoped>
.preview-img {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 12px;
}

.notes-block {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--brand-border);
  line-height: 1.6;
}
</style>
