
import { message } from 'ant-design-vue'
import router from '@/router'
import { useLoginUserStore } from '@/stores/user'

// Whether this is the first fetch for logged-in user
let firstFetchLoginUser = true;

/**
 * Global auth guard
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // On first load, wait for backend user info before checking permissions
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false;
  }
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('No permission')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
  }
  next()
})
