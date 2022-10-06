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
      const auth = useAuthStore()
      await auth.fetchLoggedUser()

      if (to.meta.admin && !auth.isAdmin) {
        next({ name: 'Forbidden' })
      }
    } catch (error) {
      if (error.response?.status === 401) {
        next({ name: 'Login', query: { returnUrl: to.fullPath } })
      }
    }
  }

  next()
})

export default router
