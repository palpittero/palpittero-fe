<template>
  <fieldset :disabled="loading">
    <form
      class="forgot-password-form d-flex flex-column gap-3"
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
      <div
        v-if="submitted && errors.unverifiedAccount"
        class="alert alert-warning"
        role="alert"
      >
        <h4 class="alert-heading">
          {{ $t('common.warning') }}
        </h4>
        <p>
          {{ errors.unverifiedAccount }}
        </p>
        <hr />
        <p class="mb-0">
          <PButton
            @click="$emit('resend-activation')"
            icon="fa-solid fa-envelope"
            :label="$t('admin.auth.resendActivationEmail')"
            :loading="loading"
            class="w-100 bg-warning"
          />
        </p>
      </div>
      <PButton
        :label="$t('admin.auth.recoverPassword.title')"
        icon="fa-solid fa-sign-in"
        class="btn-primary btn-lg"
        type="submit"
        :loading="loading"
      />
      <div class="d-flex align-items-center justify-content-between">
        <router-link
          class="d-flex align-items-center gap-2"
          style="color: var(--primary-color)"
          :to="{ name: 'SignUp' }"
        >
          <font-awesome-icon icon="fa-solid fa-user-plus" />
          {{ $t('admin.auth.createAnAccount') }}
        </router-link>
        <router-link
          class="d-flex align-items-center gap-2"
          style="color: var(--primary-color)"
          :to="{ name: 'Login' }"
        >
          <font-awesome-icon icon="fa-solid fa-sign-in" />
          {{ $t('admin.auth.signIn') }}
        </router-link>
      </div>
    </form>
  </fieldset>
</template>

<script setup>
import { computed } from 'vue'

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

const emits = defineEmits(['update:modelValue', 'submit', 'resend-activation'])

const credentials = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleSubmit = () => emits('submit', credentials)
</script>

<style lang="scss">
.forgot-password-form {
  width: 350px;
}
</style>
