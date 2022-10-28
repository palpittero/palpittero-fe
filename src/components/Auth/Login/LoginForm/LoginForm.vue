<template>
  <form class="w-full md:w-10 mx-auto" novalidate @submit.prevent>
    <div class="mb-3">
      <label for="email" class="block text-900 text-xl font-medium mb-2">{{
        $t('admin.auth.email')
      }}</label>
      <InputText
        id="email"
        v-model="credentials.email"
        type="text"
        class="w-full login__input"
        :class="{ 'p-invalid': submitted && errors.email }"
      />
      <small class="p-invalid" v-if="submitted && errors.email">
        {{ $t('admin.auth.validation.email') }}
      </small>
    </div>

    <div class="mb-3">
      <label for="password" class="block text-900 font-medium text-xl mb-2">{{
        $t('admin.auth.password')
      }}</label>
      <Password
        id="password"
        v-model="credentials.password"
        toggleMask
        :feedback="false"
        class="w-full"
        inputClass="w-full login__input"
        :class="{ 'p-invalid': submitted && errors.password }"
      />
      <small class="p-invalid" v-if="submitted && errors.password">
        {{ $t('admin.auth.validation.password') }}
      </small>
    </div>

    <div class="flex align-items-center justify-content-end mb-3">
      <router-link
        :to="{ name: 'ForgotPassword' }"
        class="font-medium no-underline text-right cursor-pointer"
        style="color: var(--primary-color)"
      >
        {{ $t('admin.auth.forgotPassword') }}
      </router-link>
    </div>
    <Button
      :label="$t('admin.auth.signIn')"
      class="w-full p-3 text-xl"
      icon="pi pi-sign-in"
      @click="handleSubmit"
      :loading="loading"
      type="submit"
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

const emits = defineEmits(['update:modelValue', 'submit'])

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
