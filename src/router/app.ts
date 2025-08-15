import type { RouteRecordRaw } from 'vue-router'

const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/App/HomePage.vue'),
  },
]

export default appRoutes
