import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import AddPicturePage from '@/pages/picture/AddPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/picture/PictureDetailPage.vue'
import AddPictureBatchPage from '@/pages/picture/AddPictureBatchPage.vue'
import SearchPicturePage from '@/pages/picture/SearchPicturePage.vue'
import UserUpdatePage from '@/pages/user/UserUpdatePage.vue'
import UserDetailPage from '@/pages/user/UserDetailPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: 'User Login',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: 'User Register',
      component: UserRegisterPage,
    },
    {
      path: '/user/update',
      name: 'Edit Account',
      component: UserUpdatePage,
    },
    {
      path: '/user/detail',
      name: 'Profile',
      component: UserDetailPage,
    },
    {
      path: '/admin/userManage',
      name: 'User Management',
      component: UserManagePage,
    },
    {
      path: '/admin/pictureManage',
      name: 'Picture Management',
      component: PictureManagePage,
    },
    {
      path: '/picture/addPicture',
      name: 'Upload Picture',
      component: AddPicturePage,
    },
    {
      path: '/picture/addPicture/batch',
      name: 'Batch Create Pictures',
      component: AddPictureBatchPage,
    },
    {
      path: '/picture/:id',
      name: 'Picture Detail',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/picture/searchPicture',
      name: 'Search Picture',
      component: SearchPicturePage,
    },

  ],
})

export default router
