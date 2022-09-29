import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT
})

instance.interceptors.request.use((config) => {
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
  ({ data }) => data.data,
  async (error) => {
    if (error?.response?.status === 401) {
      if (error?.config?.url !== '/auth/refreshToken') {
        const store = useAuthStore()
        await store.renewToken()
      } else {
        router.push({ name: 'Login' })
      }
    }

    return Promise.reject(error)
  }
)

export default instance
