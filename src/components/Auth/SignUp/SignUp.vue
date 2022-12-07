<template>
  <div
    class="container d-flex flex-column align-items-center justify-content-center h-100vh"
    :class="{ 'sign-up': !isSuccess }"
  >
    <Logo />
    <Jumbotron
      v-if="isSuccess"
      :title="$t('admin.auth.signUp.title', user)"
      :subtitle="$t('admin.auth.signUp.subtitle')"
      :message="$t('admin.auth.signUp.message')"
      :cta="{
        icon: 'fa-solid fa-sign-in',
        label: $t('admin.auth.signUp.cta'),
        route: { name: 'Login' }
      }"
    />
    <SignUpForm
      v-else
      v-model="user"
      :submitted="submitted"
      :errors="errors"
      :loading="isLoading"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup>
import services from '@/services'
import { reactive, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import { Logo, Jumbotron } from '@/components/Common'
import SignUpForm from './SignUpForm/SignUpForm.vue'

const toast = useToast()
const i18n = useI18n()
const isSuccess = ref(false)
const isLoading = ref(false)

const user = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  terms: false
})

const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required(),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf(
        [yup.ref('password')],
        i18n.t('admin.users.error.passwordsDontMatch')
      ),
    terms: yup.bool().oneOf([true])
  })
})

watch(user, (value) => setValues(value), { deep: true, immediate: true })

const onSubmit = handleSubmit(
  async (user) => {
    submitted.value = true
    try {
      isLoading.value = true
      await services.auth.signUp(user)
      isSuccess.value = true
    } catch (error) {
      if (error.response.status === 409) {
        toast.error(i18n.t('admin.auth.error.emailAlreadyInUse'))
      }

      if (error.response.status === 400) {
        toast.error(i18n.t('admin.auth.error.passwordsDontMatch'))
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
@import '@/assets/styles/styles.scss';

.sign-up {
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
