<script setup lang="ts">
import ForgotPasswordForm, { type iCredentials } from '@/components/Auth/ForgotPasswordForm.vue'
import { ref } from 'vue'
import { useToastStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import services from '@/services'

const router = useRouter()

const toastStore = useToastStore()
const route = useRoute()

const submitting = ref<boolean>(false)
const unverifiedAccount = ref<boolean>(false)
const credentials = ref<iCredentials>({
  email: '',
})

const handleSubmit = async (credentials: iCredentials) => {
  try {
    submitting.value = true
    unverifiedAccount.value = false
    await services.auth.recoverPassword(credentials)
    // @ts-expect-error Not assignable type
    router.push(route.query.returnUrl || '/')
  } catch (error: any) {
    if (error.response.status === 404) {
      toastStore.error('Usuário não encontrado')
    }

    if (error.response.status === 403) {
      unverifiedAccount.value = true
      toastStore.error('Conta não verificada')
    }
  } finally {
    submitting.value = false
  }
}

const handleResendVerificationEmail = async () => {
  try {
    submitting.value = true
    await services.auth.resendActivation(credentials.value)
  } catch (error: any) {
    if (error.response.status === 404) {
      toastStore.error('Usuário não encontrado')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="h-screen my-auto flex items-center justify-center">
    <div class="flex flex-col gap-2 items-center w-full">
      <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />
      <div v-if="unverifiedAccount" role="alert" class="alert alert-warning mb-4 flex flex-col">
        <a class="link" @click="handleResendVerificationEmail">Reenviar e-mail de verificação </a>
      </div>
      <ForgotPasswordForm v-model="credentials" :loading="submitting" @submit="handleSubmit" />
    </div>
  </div>
</template>
