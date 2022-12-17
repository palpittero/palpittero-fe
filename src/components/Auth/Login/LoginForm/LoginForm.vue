<template>
  <form
    class="login-form d-flex flex-column gap-3"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <PInput
      id="email"
      v-model="credentials.email"
      type="email"
      :label="$t('admin.auth.email')"
      :validation="{
        isInvalid: submitted && errors.email,
        message: $t('admin.auth.validation.email')
      }"
    />
    <PInput
      id="password"
      v-model="credentials.password"
      type="password"
      :validation="{
        isInvalid: submitted && errors.password,
        message: $t('admin.auth.validation.password')
      }"
      :label="$t('admin.auth.password')"
    />

    <small class="text-end">
      <router-link
        :to="{ name: 'ForgotPassword' }"
        style="color: var(--primary-color)"
      >
        {{ $t('admin.auth.forgotPassword') }}
      </router-link>
    </small>
    <PButton
      class="btn-primary btn-lg"
      :label="$t('admin.auth.signIn')"
      icon="fa-solid fa-sign-in"
      :loading="loading"
    />
    <div class="text-center">
      {{ $t('admin.auth.stillNotRegistered') }}
      <router-link style="color: var(--primary-color)" :to="{ name: 'SignUp' }">
        {{ $t('admin.auth.createAnAccount') }}
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  loading: Boolean,
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue', 'submit'])
const credentials = useVModel(props, 'modelValue', emits)

const handleSubmit = () => emits('submit', credentials)
</script>

<style lang="scss">
// @import '@/assets/styles/styles';

.login-form {
  width: 350px;

  // &__email {
  //   border-bottom-right-radius: 0 !important;
  //   border-bottom-left-radius: 0 !important;
  // }

  // &__password {
  //   border-top-left-radius: 0 !important;
  //   border-top-right-radius: 0 !important;
  //   border-bottom-right-radius: 0.375rem !important;
  // }

  // &__toggle-password {
  //   z-index: 5;
  //   right: 15px;
  //   top: 21px;
  //   cursor: pointer;

  //   &:hover {
  //     opacity: 0.7;
  //   }
  // }
}
</style>
>
