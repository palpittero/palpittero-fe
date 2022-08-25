import { defineStore } from 'pinia'
import services from '@/services'
import router from '@/router'

import { USER_ROLES } from '@/constants/users'

export const useAuthStore = defineStore('auth/user', {
  persist: true,
  state: () => ({
    accessToken: null,
    refreshToken: null,
    loggedUser: null
  }),
  actions: {
    async authenticate({ email, password }) {
      const { accessToken, refreshToken } = await services.auth.authenticate({
        email,
        password
      })

      this.accessToken = accessToken
      this.refreshToken = refreshToken

      await this.fetchLoggedUser()
      router.push({ name: 'Home' })
    },

    async fetchLoggedUser() {
      const loggedUser = await services.auth.fetchLoggedUser()
      this.loggedUser = loggedUser
    },

    async renewToken() {
      const { accessToken, refreshToken } = this

      const tokens = await services.auth.refreshToken({
        accessToken,
        refreshToken
      })

      this.accessToken = tokens.accessToken
      this.refreshToken = tokens.refreshToken
    },

    logout() {
      this.$reset()
    }
  },
  getters: {
    isAdmin: (state) => state.loggedUser?.role === USER_ROLES.ADMIN
  }
})
