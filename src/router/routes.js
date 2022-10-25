import Home from '@/pages/App/Home.vue'
import Guesses from '@/pages/App/Guesses.vue'
import UserMatchGuesses from '@/pages/App/UserMatchGuesses.vue'
import Rules from '@/pages/App/Rules.vue'
import MyAccount from '@/pages/App/MyAccount/MyAccount.vue'
import ChangePassword from '@/pages/App/MyAccount/ChangePassword.vue'
import Profile from '@/pages/App/MyAccount/Profile.vue'

import Login from '@/pages/Auth/Login.vue'
import SignUp from '@/pages/Auth/SignUp.vue'
import ActivateAccount from '@/pages/Auth/ActivateAccount.vue'
import ResetPassword from '@/pages/Auth/ResetPassword.vue'
import ForgotPassword from '@/pages/Auth/ForgotPassword.vue'
import AccountRemoved from '@/pages/Auth/AccountRemoved.vue'
import AcceptInvitation from '@/pages/Auth/AcceptInvitation.vue'

import NotFound from '@/pages/Errors/NotFound.vue'
import Forbidden from '@/pages/Errors/Forbidden.vue'

import Admin from '@/pages/Admin/Admin.vue'
import Dashboard from '@/pages/Admin/Dashboard.vue'
import Users from '@/pages/Admin/Users.vue'
import Teams from '@/pages/Admin/Teams.vue'
import Leagues from '@/pages/Admin/Leagues.vue'
import Matches from '@/pages/Admin/Matches.vue'
import Championships from '@/pages/Admin/Championships.vue'

const routes = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'MyAccount',
    component: MyAccount,
    path: '/my-account',
    redirect: '/my-account/profile',
    children: [
      {
        name: 'Profile',
        path: 'profile',
        component: Profile
      },
      {
        name: 'ChangePassword',
        path: 'change-password',
        component: ChangePassword
      }
    ]
  },
  {
    name: 'UserMatchGuesses',
    path: '/:leagueId/guesses/users/:matchId',
    component: UserMatchGuesses
  },
  {
    name: 'Guesses',
    path: '/:leagueId/guesses',
    component: Guesses
  },
  {
    name: 'Rules',
    path: '/rules',
    component: Rules
  },
  {
    name: 'Login',
    path: '/login',
    component: Login,
    meta: { public: true }
  },
  {
    name: 'SignUp',
    path: '/sign-up',
    component: SignUp,
    meta: { public: true }
  },
  {
    name: 'ActivateAccount',
    path: '/activate-account',
    component: ActivateAccount,
    meta: { public: true }
  },
  {
    name: 'ResetPassword',
    path: '/reset-password',
    component: ResetPassword,
    meta: { public: true }
  },
  {
    name: 'ForgotPassword',
    path: '/forgot-password',
    component: ForgotPassword,
    meta: { public: true }
  },
  {
    name: 'AccountRemoved',
    path: '/account-removed',
    component: AccountRemoved,
    meta: { public: true }
  },
  {
    name: 'AcceptInvitation',
    path: '/accept-invitation',
    component: AcceptInvitation
  },
  {
    name: 'NotFound',
    path: '/404',
    component: NotFound,
    meta: { public: true }
  },
  {
    name: 'Forbidden',
    path: '/forbidden',
    component: Forbidden,
    meta: { public: true }
  },
  {
    name: 'Admin',
    path: '/admin',
    component: Admin,
    meta: { admin: true },
    children: [
      {
        name: 'AdminDashboard',
        path: '',
        component: Dashboard,
        meta: { admin: true }
      },
      {
        name: 'AdminUsers',
        path: 'users',
        component: Users,
        meta: { admin: true }
      },
      {
        name: 'AdminTeams',
        path: 'teams',
        component: Teams,
        meta: { admin: true }
      },
      {
        name: 'AdminLeagues',
        path: 'leagues',
        component: Leagues,
        meta: { admin: true }
      },
      {
        name: 'AdminMatches',
        path: 'matches',
        component: Matches,
        meta: { admin: true }
      },
      {
        name: 'AdminChampionships',
        path: 'championships',
        component: Championships,
        meta: { admin: true }
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]

export default routes
