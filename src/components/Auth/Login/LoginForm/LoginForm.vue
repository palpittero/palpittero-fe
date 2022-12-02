<template>
  <form class="login-form" novalidate @submit.prevent="handleSubmit">
    <img
      class="mb-4"
      src="/images/logo-dark.svg"
      alt=""
      width="72"
      height="57"
    />
    <h1 class="h3 mb-3 fw-normal">Palpittero</h1>

    <div class="form-floating has-validation">
      <input
        type="email"
        v-model="credentials.email"
        class="login-form__email form-control"
        :class="{ 'is-invalid': submitted && errors.email }"
        id="email"
        :placeholder="$t('admin.auth.email')"
      />
      <label for="email">
        {{ $t('admin.auth.email') }}
      </label>
      <div v-if="submitted && errors.email" class="invalid-feedback">
        {{ errors.email }}
      </div>
    </div>
    <div class="form-floating">
      <input
        :type="password.type"
        v-model="credentials.password"
        class="login-form__password form-control"
        :class="{ 'is-invalid': submitted && errors.password }"
        :placeholder="$t('admin.auth.password')"
      />
      <label for="floatingPassword">
        {{ $t('admin.auth.password') }}
      </label>
      <div v-if="submitted && errors.password" class="invalid-feedback">
        {{ errors.password }}
      </div>
      <font-awesome-icon
        :icon="password.icon"
        class="login-form__toggle-password position-absolute"
        :class="{ 'is-invalid': submitted && errors.password }"
        @click="togglePassword"
      />
    </div>

    <div class="flex align-items-center justify-content-end my-3">
      <router-link
        :to="{ name: 'ForgotPassword' }"
        class="font-medium no-underline text-right cursor-pointer"
        style="color: var(--primary-color)"
      >
        {{ $t('admin.auth.forgotPassword') }}
      </router-link>
    </div>
    <Button
      class="btn-lg"
      :label="$t('admin.auth.signIn')"
      icon="fa-solid fa-sign-in"
      :loading="loading"
    />
    <div class="flex align-items-center justify-content-center my-3">
      {{ $t('admin.auth.stillNotRegistered') }}
      <router-link
        class="font-medium no-underline text-right cursor-pointer ml-2"
        style="color: var(--primary-color)"
        :to="{ name: 'SignUp' }"
      >
        {{ $t('admin.auth.createAnAccount') }}
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { computed, ref } from 'vue'

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

const showPassword = ref(false)

const credentials = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const password = computed(() =>
  showPassword.value
    ? {
        type: 'text',
        icon: 'fa-solid fa-eye-slash'
      }
    : {
        type: 'password',
        icon: 'fa-solid fa-eye'
      }
)

const togglePassword = () => (showPassword.value = !showPassword.value)
const handleSubmit = () => emits('submit', credentials)
</script>

<style lang="scss">
.login-form {
  width: 350px;
  margin-bottom: 10vh;

  &__email {
    border-bottom-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  &__password {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0.375rem !important;
  }

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
>
