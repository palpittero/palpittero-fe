<script setup lang="ts">
import LoginForm, { type iCredentials } from '@/components/Auth/LoginForm.vue'
import { ref } from 'vue'
import { useToastStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import services from '@/services'

const router = useRouter()

const toastStore = useToastStore()
const route = useRoute()

const submitting = ref<boolean>(false)
const credentials = ref<iCredentials>({
  email: '',
  password: '',
})

const handleSubmit = async (credentials: iCredentials) => {
  try {
    await services.auth.recoverPassword(credentials)
    // @ts-expect-error Not assignable type
    router.push(route.query.returnUrl || '/')
  } catch (error: any) {
    if (error.response.status === 404) {
      toastStore.error('Usuário não encontrado')
    }

    if (error.response.status === 401) {
      toastStore.error('E-mail ou senha incorretos')
    }

    if (error.response.status === 403) {
      toastStore.error('Conta não verificada')
    }
  }
}
</script>

<template>
  <div class="h-screen my-auto flex items-center justify-center">
    <div class="flex flex-col gap-2 items-center w-full">
      <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />
      <LoginForm v-model="credentials" :loading="submitting" @submit="handleSubmit" />
    </div>
  </div>
</template>
