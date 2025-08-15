import axios, { type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore()
  const { accessToken } = storeToRefs(authStore)

  if (accessToken.value) {
    config.headers['Authorization'] = `Bearer ${accessToken.value}`
  }

  config.headers['Cache-Control'] = 'no-cache'
  config.headers['Pragma'] = 'no-cache'
  config.headers['Access-Control-Allow-Origin'] = '*'

  return config
})

instance.interceptors.response.use(
  ({ data }: any) => data.data,
  async (error: any) => {
    if (error?.response?.status === 401) {
      if (error?.config?.url !== '/auth/refreshToken') {
        const store = useAuthStore()
        await store.renewToken()
      } else {
        router.push({ name: 'login' })
      }
    }

    return Promise.reject(error)
  },
)

export default instance
