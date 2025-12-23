<template>
  <div id="globalHeader">
    <a-row :wrap="false" align="middle" class="header-row">
      <a-col flex="240px">
        <RouterLink to="/">
          <div class="title-bar">
<!--            <div class="brand-mark">-->
<!--              <div class="dot dot-1"></div>-->
<!--              <div class="dot dot-2"></div>-->
<!--            </div>-->
            <div class="title">
              <div class="title-text">Cooking record</div>
            </div>
          </div>
        </RouterLink>
      </a-col>
      <!-- User info area removed; keep spacing -->
      <a-col flex="40px"></a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { HomeOutlined } from '@ant-design/icons-vue'
import { computed, h, ref } from 'vue'
import { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'

const loginUserStore = useLoginUserStore()

const current = ref<string[]>(['home'])
// Menu list
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: 'Explore',
    title: 'Explore',
  },
  {
    key: '/picture/addPicture',
    label: 'Create / Upload',
    title: 'Create / Upload',
  },
  {
    key: '/admin/userManage',
    label: 'Members & Roles',
    title: 'Members & Roles',
  },
]

// Filter menu items
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu.key.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

// Menu items to show
const items = computed<MenuProps['items']>(() => filterMenus(originItems))

const router = useRouter()

router.beforeEach((to, from, next) => {
  current.value = [to.path]
  next()
})

const doMenuClick = ({ key }: { key: string }) => {
  router
    .push({
      path: key,
    })
    .then(() => {
      // console.log('Navigation successful')
    })
    .catch((err) => {
      // console.error('Navigation failed', err)
    })
}

</script>
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-text {
  font-size: 20px;
  letter-spacing: 0.4px;
  color: #ffffff;
}

.title-sub {
  font-size: 12px;
  color: var(--brand-muted);
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(121, 246, 255, 0.25), rgba(255, 126, 182, 0.18));
  border: 1px solid var(--brand-border);
  display: grid;
  place-items: center;
  margin-right: 12px;
  position: relative;
  overflow: hidden;
}

.dot {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
}

.dot-1 {
  width: 22px;
  height: 22px;
  background: var(--brand-primary);
  top: 6px;
  left: 8px;
}

.dot-2 {
  width: 16px;
  height: 16px;
  background: var(--brand-accent);
  bottom: 6px;
  right: 6px;
}

.menu {
  justify-content: flex-end;
  padding: 6px 10px;
  min-height: 48px;
}

.header-row {
  width: 100%;
}

.user-login-status {
  display: flex;
  justify-content: flex-end;
}

.user-area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.avatar {
  border: 1px solid var(--brand-border);
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 600;
}

.user-role {
  font-size: 11px;
  color: var(--brand-muted);
  background: rgba(255, 255, 255, 0.06);
}

.menu :deep(.ant-menu-item) {
  padding-inline: 18px;
  border-radius: 999px;
  margin-inline: 4px;
}

.menu :deep(.ant-menu-item-selected) {
  background: rgba(121, 246, 255, 0.12);
}

.menu :deep(.ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.06);
}
</style>
