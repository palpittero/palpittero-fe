import type { RouteRecordRaw } from 'vue-router'

const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'app',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'app.index',
        component: () => import('@/views/App/IndexView.vue'),
      },
      {
        path: 'minha-conta',
        name: 'app.my-account',
        component: () => import('@/views/App/MyAccountView.vue'),
      },
    ],
  },
]

export default appRoutes
