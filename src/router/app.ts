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
        component: () => import('@/views/App/HomeView.vue'),
      },
      {
        path: 'minha-conta',
        name: 'app.my-account',
        component: () => import('@/views/App/MyAccountView.vue'),
      },
      {
        path: 'liga/:leagueId/palpites',
        name: 'app.guesses',
        component: () => import('@/views/App/GuessesView.vue'),
      },
      {
        path: 'regras',
        name: 'app.rules',
        component: () => import('@/views/App/RulesView.vue'),
      },
      {
        path: 'liga/:leagueId/campeonato/:championshipId/palpites',
        name: 'app.championship-guesses',
        component: () => import('@/views/App/ChampionshipGuessesView.vue'),
      },
      {
        path: 'liga/:leagueId/jogo/:matchId/palpites',
        name: 'app.match-guesses',
        component: () => import('@/views/App/MatchGuessesView.vue'),
      },
    ],
  },
]

export default appRoutes
