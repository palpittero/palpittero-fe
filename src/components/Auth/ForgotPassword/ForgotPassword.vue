<template>
  <div
    class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden login"
  >
    <div class="grid justify-content-center p-2 lg:p-0 login__container">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <img
          src="/images/logo-dark.svg"
          alt="Palpittero logo"
          class="mb-5 login__logo"
        />
      </div>
      <div v-if="isSuccess" class="text-center">
        <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">
          {{ $t('admin.auth.recoverPassword.subtitle') }}
        </h1>
        <span class="text-gray-600">{{
          $t('admin.auth.recoverPassword.message')
        }}</span>
        <div class="flex align-items-center justify-content-center mt-5">
          <i
            class="pi pi-fw pi-sign-in text-blue-500 mr-2"
            style="vertical-align: center"
          ></i>
          <router-link :to="{ name: 'Login' }" class="text-blue-500">
            {{ $t('admin.auth.recoverPassword.cta') }}</router-link
          >
        </div>
      </div>
      <div v-else class="col-12 xl:col-6 login__form-wrapper">
        <div class="h-full w-full m-0 py-7 px-4 login__form-container">
          <ForgotPasswordForm
            v-model="credentials"
            :submitted="submitted"
            :errors="errors"
            :loading="isLoading"
            @submit="onSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import ForgotPasswordForm from './ForgotPasswordForm/ForgotPasswordForm.vue'
import services from '@/services'

const toast = useToast()
const i18n = useI18n()
const isSuccess = ref(false)
const isLoading = ref(false)

const credentials = reactive({
  email: ''
})

const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    email: yup.string().required().email()
  })
})

watch(credentials, (value) => setValues(value), { deep: true, immediate: true })

const onSubmit = handleSubmit(
  async (credentials) => {
    submitted.value = true
    try {
      isLoading.value = true
      await services.auth.recoverPassword(credentials)
      isSuccess.value = true
    } catch (error) {
      if (error.response.status === 404) {
        toast.add({
          group: 'app',
          severity: 'error',
          summary: i18n.t('common.error'),
          detail: i18n.t('admin.auth.error.userNotFound'),
          life: 4000
        })
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

<style lang="scss">
.login {
  .p-inputtext {
    padding: 1rem !important;
  }

  .pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
  }

  .pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
  }

  &__logo {
    width: 81px;
    height: 60px;
  }

  &__container {
    min-width: 80%;
    margin-bottom: 30vh;
  }

  &__form {
    &-wrapper {
      border-radius: 56px;
      padding: 0.3rem;
      background: linear-gradient(
        180deg,
        var(--primary-color),
        rgba(33, 150, 243, 0) 30%
      );
    }

    &-container {
      border-radius: 53px;
      background: linear-gradient(
        180deg,
        var(--surface-50) 38.9%,
        var(--surface-0)
      );
    }
  }
}
</style>
