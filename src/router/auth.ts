import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    name: 'accept-invitation',
    path: '/aceitar-convite',
    alias: ['/accept-invitation'],
    component: () => import('@/views/Auth/AcceptInvitationView.vue'),
    // beforeEnter: (to, from, next) => {
    //   if (to.query.token) {
    //     to.query.token = to.query.token as string
    //     next()
    //   } else {
    //     next({ name: 'not-found' })
    //   }
    // },
    meta: { public: true },
  },
  {
    name: 'account-removed',
    path: '/conta-removida',
    alias: ['/account-removed'],
    component: () => import('@/views/Auth/AccountRemovedView.vue'),
    meta: { public: true },
  },
  {
    name: 'activate-account',
    path: '/ativar-conta',
    alias: ['/activate-account'],
    component: () => import('@/views/Auth/ActivateAccountView.vue'),
    beforeEnter: (to, from, next) => {
      if (to.query.token) {
        to.query.token = to.query.token as string
        next()
      } else {
        next({ name: 'not-found' })
      }
    },
    meta: { public: true },
  },
  {
    name: 'forgot-password',
    path: '/esqueci-minha-senha',
    alias: ['/forgot-password'],
    component: () => import('@/views/Auth/ForgotPasswordView.vue'),
    meta: { public: true },
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/Auth/LoginView.vue'),
    meta: { public: true },
  },
  {
    name: 'reset-password',
    path: '/redefinir-senha',
    alias: ['/reset-password'],
    component: () => import('@/views/Auth/ResetPasswordView.vue'),
    beforeEnter: (to, from, next) => {
      if (to.query.token) {
        to.query.token = to.query.token as string
        next()
      } else {
        next({ name: 'not-found' })
      }
    },
    meta: { public: true },
  },
  {
    name: 'sign-up',
    path: '/criar-conta',
    alias: ['/sign-up'],
    component: () => import('@/views/Auth/SignUpView.vue'),
    meta: { public: true },
  },
]

export default authRoutes
