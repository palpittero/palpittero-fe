<template>
  <main
    class="login container d-flex align-items-center justify-content-center w-full text-center h-100vh"
  >
    <LoginForm
      v-model="credentials"
      :submitted="submitted"
      :errors="errors"
      :loading="isLoading"
      @submit="onSubmit"
    />
  </main>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import * as yup from 'yup'

import LoginForm from './LoginForm/LoginForm.vue'
import 'bootstrap'

const toast = useToast()
const i18n = useI18n()
const isLoading = ref(false)
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const credentials = reactive({
  email: '',
  password: ''
})

const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required()
  })
})

watch(credentials, (value) => setValues(value), { deep: true, immediate: true })

const onSubmit = handleSubmit(
  async (credentials) => {
    submitted.value = true
    try {
      isLoading.value = true
      await auth.authenticate(credentials)
      router.push(route.query.returnUrl || { name: 'Home' })
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(i18n.t('admin.auth.error.userNotFound'))
      }

      if (error.response.status === 401) {
        toast.error(i18n.t('admin.auth.error.invalidCredentials'))
      }

      if (error.response.status === 403) {
        toast.error(i18n.t('admin.auth.error.unverifiedAccount'))
      }
    } finally {
      isLoading.value = false
    }
  },
  () => {
    submitted.value = true
  }
)
</script>
