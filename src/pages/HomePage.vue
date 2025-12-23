<template>
  <div id="homePage">
    <div class="hero">
      <div class="hero-text">
        <div class="eyebrow">Cooking Record Platform</div>
        <h1>Curate your menus, keep every recipe in one place</h1>
        <p>A streamlined cooking record hub to capture dishes, notes, and inspirations with a fresh futuristic vibe.</p>
        <div class="hero-actions">
          <template v-if="isLogin">
            <a-button type="primary" size="large" class="pill" @click="goUpload">Upload now</a-button>
            <a-button size="large" class="pill logout-btn" @click="doLogout">Log out</a-button>
          </template>
          <template v-else>
            <a-button type="primary" size="large" class="pill" @click="goLogin">Log in / Sign up</a-button>
          </template>
        </div>
      </div>
      <div class="hero-card frosted">
        <div class="hero-metric">
          <div class="metric-value brand-gradient">{{ total || '···' }}</div>
          <div class="metric-label">Menus available</div>
        </div>
        <div class="hero-user" v-if="isLogin">
          <a-avatar size="large" class="hero-avatar">
            <template #icon>
              <img :src="loginUserStore.loginUser.userAvatar || defaultAvatar" alt="avatar" />
            </template>
          </a-avatar>
          <div class="hero-user-meta">
            <div class="hero-user-name">{{ loginUserStore.loginUser.userName || 'Guest' }}</div>
            <div class="hero-user-role chip pill">{{ loginUserStore.loginUser.userRole || 'member' }}</div>
          </div>
        </div>
        <div class="hero-user" v-else>
          <a-avatar size="large" class="hero-avatar">
            <template #icon>
              <img :src="defaultAvatar" alt="avatar" />
            </template>
          </a-avatar>
          <div class="hero-user-meta">
            <div class="hero-user-name">Not logged in</div>
            <div class="hero-user-role chip pill">member</div>
          </div>
        </div>
      </div>
    </div>

    <div class="search-panel frosted">
      <div class="search-bar">
        <a-input-search
          placeholder="Type a dish or note to search your menus"
          v-model:value="searchParams.searchText"
          enter-button="Search menus"
          size="large"
          @search="doSearch"
        />
      </div>
    </div>

    <div class="list-section">
      <PictureList :dataList="dataList" :loading="loading" />
      <div class="pagination-bar">
        <a-pagination
          v-model:current="searchParams.current"
          v-model:pageSize="searchParams.pageSize"
          :total="total"
          @change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Data
import { computed, onMounted, reactive, ref } from 'vue'
import {
  listPictureVoByPageUsingPost,
} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import PictureList from '@/components/PictureList.vue'
import { useLoginUserStore } from '@/stores/user'
import { userLogoutUsingPost } from '@/api/userController'

const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// Search params
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

const onPageChange = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

// Pagination (legacy example)
// const pagination = computed(() => {
//   return {
//     current: searchParams.current ?? 1,
//     pageSize: searchParams.pageSize ?? 10,
//     total: total.value,
//     // When page changes, update search params and refetch
//     onChange: (page, pageSize) => {
//       searchParams.current = page
//       searchParams.pageSize = pageSize
//       fetchData()
//     },
//   }
// })

// Fetch data
const fetchData = async () => {
  loading.value = true
  // build search params
  const params = { ...searchParams }
  // console.log(params)
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('Failed to load data: ' + res.data.message + ' ' + res.data.description)
  }
  loading.value = false
}

// Initial load
onMounted(() => {
  fetchData()
})

const doSearch = () => {
  // reset search
  searchParams.current = 1
  fetchData()
}

const router = useRouter()
const loginUserStore = useLoginUserStore()
const isLogin = computed(() => !!loginUserStore.loginUser.id)
const defaultAvatar = 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=160&q=60'

const goUpload = () => router.push('/picture/addPicture')
const goLogin = () => router.push('/user/login')
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({ userName: 'Not logged in' })
    message.success('Logged out')
    await router.push('/user/login')
  } else {
    message.error('Logout failed: ' + res.data.message + ' ' + res.data.description)
  }
}
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.hero-text h1 {
  margin: 8px 0 12px;
  font-size: 32px;
  line-height: 1.2;
}

.hero-text p {
  color: var(--brand-muted);
  margin: 0 0 16px;
  max-width: 520px;
}

.eyebrow {
  color: var(--brand-primary);
  font-weight: 600;
  letter-spacing: 0.6px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.logout-btn {
  border: 1px solid #111 !important;
  color: #111 !important;
  background: transparent !important;
}

.logout-btn:hover,
.logout-btn:focus {
  color: #111 !important;
  border-color: #111 !important;
  box-shadow: none !important;
  background: rgba(0, 0, 0, 0.04) !important;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border-radius: 18px;
  flex-wrap: wrap;
}

.hero-metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--brand-border);
  background: rgba(255, 255, 255, 0.02);
  min-width: 180px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
}

.metric-label {
  color: var(--brand-muted);
  font-size: 12px;
}

.hero-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--brand-border);
  background: rgba(255, 255, 255, 0.02);
}

.hero-avatar {
  border: 1px solid var(--brand-border);
}

.hero-user-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-user-name {
  font-weight: 600;
}

.hero-user-role {
  font-size: 11px;
  color: var(--brand-muted);
  background: rgba(255, 255, 255, 0.06);
}

.search-panel {
  margin: 10px 0 20px;
  padding: 18px;
  border-radius: 18px;
}

.search-bar {
  max-width: 600px;
  margin: 0 0 12px;
}

.filter-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.filter-block {
  border: 1px solid var(--brand-border);
  border-radius: 14px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.02);
}

.filter-title {
  color: var(--brand-muted);
  margin-bottom: 8px;
  font-size: 13px;
}

.tag-block {
  overflow: hidden;
}

.tag-chip {
  color: var(--brand-text);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--brand-border);
}

.list-section {
  border-radius: 20px;
  border: 1px solid var(--brand-border);
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 640px) {
  .hero-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
