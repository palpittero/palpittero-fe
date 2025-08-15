import { defineStore } from 'pinia'
import services from '@/services'

import { USER_ROLES } from '@/constants'
import type { iUser } from '@/types'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth/user', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loggedUser = ref<iUser | null>(null)
  const authenticating = ref(false)

  const isAdmin = computed<boolean>(() => loggedUser.value?.role === USER_ROLES.ADMIN)

  async function authenticate({ email, password }: { email: string; password: string }) {
    authenticating.value = true
    const { accessToken, refreshToken } = await services.auth.authenticate({
      email,
      password,
    })

    accessToken.value = accessToken
    refreshToken.value = refreshToken

    loggedUser.value = await services.auth.fetchLoggedUser()
    authenticating.value = false
  }

  async function renewToken() {
    // const { accessToken, refreshToken } = this

    const tokens = await services.auth.refreshToken({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    })

    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
  }

  function logout() {
    const store = useAuthStore()
    store.$reset()
  }

  return {
    accessToken,
    refreshToken,
    loggedUser,
    authenticating,
    authenticate,
    renewToken,
    logout,
    isAdmin,
  }
})
