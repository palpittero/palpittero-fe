<script setup lang="ts">
import ResetPasswordForm, { type iCredentials } from '@/components/Auth/ResetPasswordForm.vue'
import { onMounted, ref } from 'vue'
import { useToastStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import services from '@/services'
import { omit } from 'lodash/fp'

const router = useRouter()

const toastStore = useToastStore()
const route = useRoute()

const loading = ref<boolean>(false)
const submitting = ref<boolean>(false)

const credentials = ref<iCredentials>({
  token: '',
  password: '',
  passwordConfirmation: '',
})

const handleSubmit = async (credentials: iCredentials) => {
  try {
    submitting.value = true
    await services.auth.resetPassword(credentials)
    // @ts-expect-error Not assignable type
    router.push(route.query.returnUrl || '/')
  } catch (error: any) {
    if (error.response.status === 404) {
      toastStore.error('Usuário não encontrado')
    }
  } finally {
    submitting.value = false
  }
}

const validateToken = async () => {
  try {
    loading.value = true

    const token = route.query.token as string

    await services.auth.validateToken(token)

    credentials.value.token = token
    router.replace(omit('query', route))
  } catch (error: any) {
    if (error.response.status === 422) {
      toastStore.error('Token inválido ou expirado')
    }

    if (error.response.status === 404) {
      toastStore.error('Usuário não encontrado')
    }
  } finally {
    loading.value = false
  }
}

onMounted(validateToken)
</script>

<template>
  <div class="h-screen my-auto flex items-center justify-center">
    <div class="flex flex-col gap-2 items-center w-full">
      <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />
      <ResetPasswordForm v-model="credentials" :loading="submitting" @submit="handleSubmit" />
    </div>
  </div>
</template>
