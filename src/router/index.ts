import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './auth'
import appRoutes from './app'
import errorRoutes from './errors'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...appRoutes, ...errorRoutes],
})

export default router
