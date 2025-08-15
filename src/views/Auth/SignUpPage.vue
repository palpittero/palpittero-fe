<script setup lang="ts">
import SignUpForm, { type iCredentials } from '@/components/Auth/SignUpForm.vue'
import { ref } from 'vue'
import { useToastStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import services from '@/services'

const router = useRouter()

const toastStore = useToastStore()
const route = useRoute()

const submitting = ref<boolean>(false)
const credentials = ref<iCredentials>({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const handleSubmit = async (credentials: iCredentials) => {
  try {
    await services.auth.signUp(credentials)
    // @ts-expect-error Not assignable type
    router.push(route.query.returnUrl || '/')
  } catch (error: any) {
    if (error.response.status === 409) {
      toastStore.error('E-mail já cadastrado')
    }

    if (error.response.status === 400) {
      toastStore.error('Senhas não conferem')
    }
  }
}
</script>

<template>
  <div class="h-screen my-auto flex items-center justify-center">
    <div class="flex flex-col gap-2 items-center w-full">
      <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />
      <SignUpForm v-model="credentials" :loading="submitting" @submit="handleSubmit" />
    </div>
  </div>
</template>
