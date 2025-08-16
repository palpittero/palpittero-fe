import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin.index',
        component: () => import('@/views/Admin/IndexView.vue'),
      },
    ],
  },
]

export default adminRoutes
