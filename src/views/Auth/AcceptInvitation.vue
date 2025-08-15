<script setup lang="ts">
import services from '@/services'

import { omit } from 'lodash/fp'

import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const state = reactive({
  loading: false,
  success: true,
  error: false,
})

const league = ref<string>('')

const activateAccount = async () => {
  try {
    state.loading = true
    const { token, league: name } = route.query

    league.value = name as string

    await services.usersLeagues.acceptInvitation(token as string)
  } catch (error: any) {
    state.error = error
  } finally {
    router.replace(omit('query', route))
    state.loading = false
  }
}

onBeforeMount(() => {
  console.log(route.query)
})

onMounted(activateAccount)
</script>

<template>
  <div class="h-screen my-auto flex flex-col items-center justify-center">
    <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />

    <div class="hero">
      <div class="hero-content text-center">
        <div class="gap-6 flex flex-col items-center">
          <template v-if="state.loading">
            <span class="loading loading-ring loading-xl" />
            <h1 class="text-5xl font-bold">Entrando na liga {{ league }}</h1>
            <p>Aguarde enquanto sua participação é aprovada.</p>
          </template>
          <template v-else-if="state.error">
            <h1 class="text-5xl font-bold">Não foi possível entrar na liga {{ league }}</h1>
            <p>Token inválido ou expirado.</p>
          </template>
          <template v-else-if="state.success">
            <h1 class="text-5xl font-bold">Agora você faz parte da liga {{ league }}</h1>
            <router-link :to="{ name: 'home' }" class="link mt-try">Ver minhas ligas</router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
