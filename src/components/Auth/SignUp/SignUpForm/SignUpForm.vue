<template>
  <form class="signup-form d-flex flex-column gap-3" novalidate @submit.prevent>
    <PInput
      id="name"
      v-model="user.name"
      type="text"
      :validation="{
        isInvalid: submitted && errors.name,
        message: $t('admin.auth.validation.name')
      }"
      :label="$t('admin.auth.name')"
    />
    <PInput
      id="email"
      type="email"
      :model-value="user.email"
      :label="$t('admin.auth.email')"
      :validation="{
        isInvalid: submitted && errors.email,
        message: $t('admin.auth.validation.email')
      }"
      @update:model-value="handleEmailUpdate"
    />

    <PInput
      id="password"
      v-model="user.password"
      autocomplete="off"
      type="password"
      :label="$t('admin.auth.password')"
      :validation="{
        isInvalid: submitted && errors.password,
        message: $t('admin.auth.validation.password')
      }"
    />

    <PInput
      v-model="user.passwordConfirmation"
      :label="$t('admin.auth.passwordConfirmation')"
      type="password"
      :validation="{
        isInvalid: submitted && errors.passwordConfirmation,
        message: $t('admin.auth.validation.passwordConfirmation')
      }"
    />

    <PCheckbox
      v-model="user.terms"
      id="terms"
      :validation="{
        isInvalid: submitted && errors.terms,
        message: $t('admin.auth.validation.terms')
      }"
    >
      <Button class="btn btn-link text-black p-0" @click.stop="handleTerms">
        {{ $t('common.termsAndConditions') }}
      </Button>
    </PCheckbox>

    <PButton
      type="submit"
      class="btn-primary btn-lg"
      icon="fa-solid fa-user-plus"
      :label="$t('admin.auth.createAccount')"
      :loading="loading"
      @click="handleSubmit"
    />

    <div class="text-center">
      {{ $t('admin.auth.alreadyHaveAnAccount') }}
      <router-link style="color: var(--primary-color)" :to="{ name: 'Login' }">
        {{ $t('admin.auth.signIn') }}
      </router-link>
    </div>

    <SignUpTermsDialog
      :visible="isTermsDialogVisible"
      @hide="handleTermsDialogHide"
    />
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

import SignUpTermsDialog from './SignUpTermsDialog/SignUpTermsDialog.vue'

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

const isTermsDialogVisible = ref(false)

const emits = defineEmits(['update:modelValue', 'submit'])

const user = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleEmailUpdate = (value) =>
  (user.value.email = value.toLowerCase().trim())

const handleTerms = () => (isTermsDialogVisible.value = true)

const handleTermsDialogHide = () => (isTermsDialogVisible.value = false)

const handleSubmit = () => emits('submit', user)
</script>

<style lang="scss">
.signup-form {
  width: 350px;

  &__toggle-password {
    z-index: 5;
    right: 15px;
    top: 21px;
    cursor: pointer;

    &.is-invalid {
      right: 35px;
    }

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
