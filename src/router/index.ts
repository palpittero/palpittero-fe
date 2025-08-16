import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import authRoutes from './auth'
import appRoutes from './app'
import adminRoutes from './admin'
import errorRoutes from './errors'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...appRoutes, ...adminRoutes, ...errorRoutes],
})

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (!to.meta.public) {
      try {
        const auth = useAuthStore()
        await auth.fetchLoggedUser()

        if (to.meta.admin && !auth.isAdmin) {
          next({ name: 'not-found' })
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          next({ name: 'login', query: { returnUrl: to.fullPath } })
        }
      }
    }

    next()
  },
)

export default router
