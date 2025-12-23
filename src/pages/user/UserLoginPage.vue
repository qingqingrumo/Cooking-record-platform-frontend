<template>
  <div class="auth-page">
    <div class="panel">
      <h2 class="title">Cooking Record · Sign in</h2>
      <p class="desc">Login your account to save menus and cooking notes.</p>
      <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" layout="vertical">
        <a-form-item label="Account" name="userAccount" :rules="[{ required: true, message: 'Please enter account' }]">
          <a-input v-model:value="formState.userAccount" placeholder="Account" />
        </a-form-item>
        <a-form-item label="Password" name="userPassword" :rules="[
          { required: true, message: 'Please enter password' },
          { min: 8, message: 'Password must be at least 8 characters' },
        ]">
          <a-input-password v-model:value="formState.userPassword" placeholder="Password" />
        </a-form-item>
        <div class="tips">
          No account?
          <RouterLink to="/user/register">Sign up</RouterLink>
        </div>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>Sign in</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'
import { userLoginUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const router = useRouter()
const loginUserStore = useLoginUserStore()

/**
 * Submit form
 * @param values
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  // save login state
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('Signed in')
    console.log("login666")
    await router.push({
      path: '/',
      replace: true,
    })
  } else {
    message.error('Sign in failed: ' + res.data.message + ' ' + res.data.description)
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.panel {
  width: 360px;
  background: #ffffff;
  border: 1px solid rgba(31, 41, 55, 0.12);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  padding: 24px 24px 18px;
}

.title {
  text-align: center;
  margin: 0 0 8px;
  color: #111827;
}

.desc {
  text-align: center;
  color: #6b7280;
  margin: 0 0 20px;
  font-size: 13px;
}

.tips {
  margin: 4px 0 14px;
  color: #6b7280;
  font-size: 13px;
  text-align: right;
}
</style>
