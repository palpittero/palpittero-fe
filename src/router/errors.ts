import type { RouteRecordRaw } from 'vue-router'

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/Errors/NotFoundPage.vue'),
    meta: { public: true },
  },
]

export default errorRoutes
