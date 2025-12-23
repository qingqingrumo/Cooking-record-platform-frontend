<template>
  <div class="userDetailPage">
    <a-row :gutter="[16, 16]" position="center">
      <!-- User info -->
      <a-col>
        <a-card title="User Info">
          <a-descriptions :column="1">
            <a-descriptions-item label="Avatar">
              <a-space>
                <a-avatar :size="300" :src="user.userAvatar" />
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="Username">
              {{ user.userName ?? 'Anonymous' }}
            </a-descriptions-item>
            <a-descriptions-item label="Account">
              {{ user.userAccount }}
            </a-descriptions-item>
            <a-descriptions-item label="ID">
              {{ user.id }}
            </a-descriptions-item>
            <a-descriptions-item label="Profile">
              {{ user.userProfile ?? 'No profile yet' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-space wrap>
            <a-button type="default" @click="doEdit">
              Edit
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'
import router from '@/router'
import { getLoginUserUsingGet } from '@/api/userController'

const user = ref<API.UserVo>({})

// Fetch user detail
const fetchUserDetail = async () => {
  try {
    const res = await getLoginUserUsingGet({})
    if (res.data.code === 0 && res.data.data) {
      user.value = res.data.data
      // console.log(res.data.data)
    } else {
      message.error('Failed to get user detail: ' + res.data.message + ' ' + res.data.description)
    }
  } catch (e: any) {
    message.error('Failed to get user detail: ' + e.message)
  }
}

// Edit
const doEdit = () => {
  router.push({
    path: '/user/update',
    query: {
      userId: user.value.id,
      userName: user.value.userName,
      userAccount: user.value.userAccount,
      userProfile: user.value.userProfile,
      userAvatar: user.value.userAvatar,
    },
  })
}

onMounted(() => {
  fetchUserDetail()
  // console.log(picture.value.permissionList)
})
</script>
<style scoped>
.userDetailPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
