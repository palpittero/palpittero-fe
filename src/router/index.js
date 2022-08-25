import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.public) {
    try {
      const { isAdmin, fetchLoggedUser } = useAuthStore()
      await fetchLoggedUser()

      if (to.meta.admin && !isAdmin) {
        next({ name: 'Forbidden' })
      }
    } catch (error) {
      if (error.response?.status === 401) {
        next({ name: 'Login' })
      }
    }
  }

  next()
})

export default router
