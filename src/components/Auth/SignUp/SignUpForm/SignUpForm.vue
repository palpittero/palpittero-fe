<template>
  <div class="w-full md:w-10 mx-auto">
    <label for="name" class="block text-900 text-xl font-medium mb-2">{{
      $t('admin.auth.name')
    }}</label>
    <div class="mb-3">
      <InputText
        id="name"
        v-model="user.name"
        type="text"
        class="w-full login__input"
        :class="{ 'p-invalid': submitted && errors.name }"
      />
      <small class="p-invalid" v-if="submitted && errors.name">
        {{ $t('admin.auth.validation.name') }}
      </small>
    </div>
    <div class="mb-3">
      <label for="email" class="block text-900 text-xl font-medium mb-2">{{
        $t('admin.auth.email')
      }}</label>
      <InputText
        id="email"
        v-model="user.email"
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
        v-model="user.password"
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

    <div class="mb-3">
      <label
        for="password-confirmation"
        class="block text-900 font-medium text-xl mb-2"
        >{{ $t('admin.auth.passwordConfirmation') }}</label
      >
      <Password
        id="password-confirmation"
        v-model="user.passwordConfirmation"
        toggleMask
        :feedback="false"
        class="w-full"
        inputClass="w-full login__input"
        :class="{ 'p-invalid': submitted && errors.passwordConfirmation }"
      />
      <small class="p-invalid" v-if="submitted && errors.passwordConfirmation">
        {{ $t('admin.auth.validation.passwordConfirmation') }}
      </small>
    </div>
    <Button
      :label="$t('admin.auth.createAccount')"
      class="w-full p-3 text-xl"
      icon="pi pi-user-edit"
      @click="handleSubmit"
      :loading="loading"
    />
    <div class="flex align-items-center justify-content-center my-3">
      {{ $t('admin.auth.alreadyHaveAnAccount') }}
      <router-link
        class="font-medium no-underline text-right cursor-pointer ml-2"
        style="color: var(--primary-color)"
        :to="{ name: 'Login' }"
      >
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

const user = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleSubmit = () => emits('submit', user)
</script>
