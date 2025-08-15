import axios, { type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = useAuthStore()

  if (auth.accessToken) {
    config.headers['Authorization'] = `Bearer ${auth.accessToken}`
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
