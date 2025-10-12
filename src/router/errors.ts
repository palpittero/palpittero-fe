import type { RouteRecordRaw } from 'vue-router'

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/Errors/ErrorView.vue'),
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/Errors/NotFoundView.vue'),
    meta: { public: true },
  },
]

export default errorRoutes
