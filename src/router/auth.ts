import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    name: 'accept-invitation',
    path: '/aceitar-convite',
    alias: ['/accept-invitation'],
    component: () => import('@/views/Auth/AcceptInvitation.vue'),
    // beforeEnter: (to, from, next) => {
    //   if (to.query.token) {
    //     to.query.token = to.query.token as string
    //     next()
    //   } else {
    //     next({ name: 'not-found' })
    //   }
    // },
  },
  {
    name: 'account-removed',
    path: '/conta-removida',
    alias: ['/account-removed'],
    component: () => import('@/views/Auth/AccountRemovedPage.vue'),
  },
  {
    name: 'activate-account',
    path: '/ativar-conta',
    alias: ['/activate-account'],
    component: () => import('@/views/Auth/ActivateAccountPage.vue'),
    beforeEnter: (to, from, next) => {
      if (to.query.token) {
        to.query.token = to.query.token as string
        next()
      } else {
        next({ name: 'not-found' })
      }
    },
  },
  {
    name: 'forgot-password',
    path: '/esqueci-minha-senha',
    alias: ['/forgot-password'],
    component: () => import('@/views/Auth/ForgotPasswordPage.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/Auth/LoginPage.vue'),
  },
  {
    name: 'reset-password',
    path: '/redefinir-senha',
    alias: ['/reset-password'],
    component: () => import('@/views/Auth/ResetPasswordPage.vue'),
    beforeEnter: (to, from, next) => {
      if (to.query.token) {
        to.query.token = to.query.token as string
        next()
      } else {
        next({ name: 'not-found' })
      }
    },
  },
  {
    name: 'sign-up',
    path: '/criar-conta',
    alias: ['/sign-up'],
    component: () => import('@/views/Auth/SignUpPage.vue'),
  },
]

export default authRoutes
