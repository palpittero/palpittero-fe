<template>
  <div class="w-full md:w-10 mx-auto">
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
    <Button
      :label="$t('admin.auth.recoverPassword.title')"
      class="w-full p-3 text-xl"
      icon="pi pi-sign-in"
      @click="handleSubmit"
      :loading="loading"
    />
    <div class="flex align-items-center justify-content-between my-3">
      <router-link
        class="flex align-items-center gap-2 font-medium no-underline cursor-pointer ml-2"
        style="color: var(--primary-color)"
        :to="{ name: 'SignUp' }"
      >
        <span class="pi pi-user-edit" />
        {{ $t('admin.auth.createAnAccount') }}
      </router-link>
      <router-link
        class="flex align-items-center gap-2 font-medium no-underline text-right cursor-pointer ml-2"
        style="color: var(--primary-color)"
        :to="{ name: 'Login' }"
      >
        <span class="pi pi-sign-in" />
        {{ $t('admin.auth.signIn') }}
      </router-link>
    </div>
  </div>
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
