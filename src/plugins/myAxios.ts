import axios from 'axios'
import { message } from 'ant-design-vue'
// Distinguish dev and prod
const DEV_BASE_URL = "http://localhost:8123";
const PROD_BASE_URL = "https://picture-share-platform-xjzai-bsete9gmckfdfudg.centralindia-01.azurewebsites.net";
// Create Axios instance
const myAxios = axios.create({
  // baseURL: PROD_BASE_URL,
  baseURL: DEV_BASE_URL,
  timeout: 60000,
  withCredentials: true,
})

// Request interceptor
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Response interceptor
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // Not logged in
    if (data.code === 40100) {
      // redirect to login if not already
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('Please log in')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default myAxios
