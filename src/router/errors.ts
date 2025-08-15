const errorRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/Errors/NotFoundPage.vue'),
  },
]

export default errorRoutes
