<template>
  <div class="auth-page">
    <div class="panel">
      <h2 class="title">Cooking Record · Sign up</h2>
      <p class="desc">Create your account to save menus and cooking notes.</p>
      <a-form :model="formState" name="basic" label-align="left" autocomplete="off" @finish="handleSubmit" layout="vertical">
        <a-form-item label="Account" name="userAccount" :rules="[{ required: true, message: 'Please enter account' }]">
          <a-input v-model:value="formState.userAccount" placeholder="Account" />
        </a-form-item>
        <a-form-item label="Username" name="userName" :rules="[{ required: true, message: 'Please enter username' }]">
          <a-input v-model:value="formState.userName" placeholder="Username" />
        </a-form-item>
        <a-form-item label="Password" name="userPassword" :rules="[
          { required: true, message: 'Please enter password' },
          { min: 8, message: 'Password must be at least 8 characters' },
        ]">
          <a-input-password v-model:value="formState.userPassword" placeholder="Password" />
        </a-form-item>
        <a-form-item label="Confirm password" name="checkPassword" :rules="[
          { required: true, message: 'Please confirm password' },
          { min: 8, message: 'Confirm password must be at least 8 characters' },
        ]">
          <a-input-password v-model:value="formState.checkPassword" placeholder="Confirm password" />
        </a-form-item>
        <div class="tips">
          Already have an account?
          <RouterLink to="/user/login">Sign in</RouterLink>
        </div>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>Sign up</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userRegisterUsingPost } from '@/api/userController'

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userName: '',
  userPassword: '',
  checkPassword: '',
})
const router = useRouter()

/**
 * Submit form
 * @param values
 */
const handleSubmit = async (values: any) => {
  // check password match
  if (formState.userPassword !== formState.checkPassword) {
    message.error('Passwords do not match')
    return
  }
  const res = await userRegisterUsingPost(values)
  // success => to login
  if (res.data.code === 0 && res.data.data) {
    message.success('Registered successfully')
    await router.push({
      path: '/user/login',
      replace: true,
    })
  } else {
    message.error('Register failed: ' + res.data.message + ' ' + res.data.description)
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
