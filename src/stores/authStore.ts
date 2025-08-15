import { defineStore } from 'pinia'
import services from '@/services'

import { USER_ROLES } from '@/constants'
import type { iUser } from '@/types'
import { computed, ref } from 'vue'
import { useLocalStorage, useRafFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth/user', () => {
  const accessToken = useLocalStorage<string>('palpittero/accessToken', '')
  const refreshToken = useLocalStorage<string>('palpittero/refreshToken', '')

  const loggedUser = ref<iUser | null>(null)
  const authenticating = ref(false)

  const isAdmin = computed<boolean>(() => loggedUser.value?.role === USER_ROLES.ADMIN)

  async function authenticate({ email, password }: { email: string; password: string }) {
    authenticating.value = true
    const tokens = await services.auth.authenticate({
      email,
      password,
    })

    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken

    fetchLoggedUser()
    authenticating.value = false
  }

  async function fetchLoggedUser() {
    loggedUser.value = await services.auth.fetchLoggedUser()
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
    accessToken.value = ''
    refreshToken.value = ''
    loggedUser.value = null

    window.location.href = '/login'
  }

  return {
    accessToken,
    refreshToken,
    loggedUser,
    authenticating,
    authenticate,
    renewToken,
    logout,
    fetchLoggedUser,
    isAdmin,
  }
})
