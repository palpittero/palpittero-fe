<template>
  <div
    class="container d-flex flex-column align-items-center justify-content-center h-100vh"
    :class="{ 'forgot-password': !isSuccess }"
  >
    <Logo />
    <Jumbotron
      v-if="isRecoverPasswordSuccess"
      :title="$t('admin.auth.recoverPassword.title')"
      :subtitle="$t('admin.auth.recoverPassword.subtitle')"
      :message="$t('admin.auth.recoverPassword.message')"
      :cta="{
        icon: 'fa-solid fa-sign-in',
        label: $t('admin.auth.recoverPassword.cta'),
        route: { name: 'Login' }
      }"
    />

    <Jumbotron
      v-else-if="isResendActivationEmailSuccess"
      :title="$t('admin.auth.resendActivation.title')"
      :subtitle="$t('admin.auth.resendActivation.subtitle')"
      :message="$t('admin.auth.resendActivation.message')"
      :cta="{
        icon: 'fa-solid fa-sign-in',
        label: $t('admin.auth.resendActivation.cta'),
        route: { name: 'Login' }
      }"
    />

    <ForgotPasswordForm
      v-else
      v-model="credentials"
      :submitted="submitted"
      :errors="errors"
      :loading="isLoading"
      @submit="onSubmit"
      @resend-activation="onResendActivation"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import services from '@/services'

import { Logo, Jumbotron } from '@/components/Common'
import ForgotPasswordForm from './ForgotPasswordForm/ForgotPasswordForm.vue'

const toast = useToast()
const i18n = useI18n()
const isRecoverPasswordSuccess = ref(false)
const isResendActivationEmailSuccess = ref(false)
const isLoading = ref(false)

const credentials = reactive({
  email: ''
})

const submitted = ref(false)

const { errors, handleSubmit, setValues, setFieldError } = useForm({
  validationSchema: yup.object().shape({
    email: yup.string().required().email()
  }),
  unverifiedAccount: yup.string().optional()
})

watch(credentials, (value) => setValues(value), { deep: true, immediate: true })

const onSubmit = handleSubmit(
  async (credentials) => {
    submitted.value = true
    try {
      isLoading.value = true
      await services.auth.recoverPassword(credentials)
      isRecoverPasswordSuccess.value = true
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(i18n.t('admin.auth.error.userNotFound'))
      }

      if (error.response.status === 403) {
        setFieldError(
          'unverifiedAccount',
          i18n.t('admin.auth.error.resendActivationEmail')
        )
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

const onResendActivation = async () => {
  try {
    isLoading.value = true
    await services.auth.resendActivation(credentials)
    isResendActivationEmailSuccess.value = true
  } catch (error) {
    if (error.response.status === 404) {
      toast.error(i18n.t('admin.auth.error.userNotFound'))
    }
  } finally {
    isLoading.value = false
  }
}

const isSuccess = computed(
  () => isRecoverPasswordSuccess.value || isResendActivationEmailSuccess.value
)
</script>

<style lang="scss">
@import '@/assets/styles/styles.scss';

.forgot-password {
  @include media-breakpoint-down(lg) {
    @media (orientation: landscape) {
      height: auto !important;
    }
  }

  @include media-breakpoint-up(md) {
    @media (orientation: portrait) {
      margin-bottom: 30vh;
    }
  }
}
</style>
