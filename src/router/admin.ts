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
      {
        path: 'palpites',
        name: 'admin.guesses',
        component: () => import('@/views/Admin/GuessesView.vue'),
      },
      {
        path: 'palpites/:leagueId',
        name: 'admin.guesses-league',
        component: () => import('@/views/Admin/GuessesLeagueView.vue'),
      },
      {
        path: 'usuarios',
        name: 'admin.users',
        component: () => import('@/views/Admin/UsersView.vue'),
      },
      {
        path: 'ligas',
        name: 'admin.leagues',
        component: () => import('@/views/Admin/LeaguesView.vue'),
      },
      {
        path: 'times',
        name: 'admin.teams',
        component: () => import('@/views/Admin/TeamsView.vue'),
      },
      {
        path: 'campeonatos',
        name: 'admin.championships',
        component: () => import('@/views/Admin/ChampionshipsView.vue'),
      },
      {
        path: 'partidas',
        name: 'admin.matches',
        component: () => import('@/views/Admin/MatchesView.vue'),
      },
      {
        path: ':pathMatch(.*)*',
        name: 'admin.not-found',
        component: () => import('@/views/Admin/NotFoundView.vue'),
      },
    ],
  },
]

export default adminRoutes
