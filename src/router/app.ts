const appRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/App/HomePage.vue'),
  },
]

export default appRoutes
