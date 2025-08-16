<script setup lang="ts">
import services from '@/services'
import { omit } from 'lodash/fp'

import { onBeforeMount, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const state = reactive({
  loading: false,
  success: true,
  error: false,
})

const activateAccount = async () => {
  try {
    state.loading = true
    const token = route.query.token as string

    await services.auth.activateAccount(token)
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
            <h1 class="text-5xl font-bold">Ativando a sua conta</h1>
            <p>Em breve ela estará pronta e você poderá realizar login na plataforma.</p>
          </template>
          <template v-else-if="state.error">
            <h1 class="text-5xl font-bold">Erro ao ativar a sua conta</h1>
            <p>Token inválido ou expirado.</p>
          </template>
          <template v-else-if="state.success">
            <h1 class="text-5xl font-bold">Sua conta foi ativada com sucesso</h1>
            <router-link :to="{ name: 'login' }" class="link">Fazer login</router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
