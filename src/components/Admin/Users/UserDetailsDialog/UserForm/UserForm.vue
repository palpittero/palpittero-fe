<template>
  <div class="field">
    <label for="name">{{ $t('admin.users.name') }}</label>
    <InputText
      id="name"
      v-model.trim="user.name"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.name }"
    />
    <small class="p-invalid" v-if="submitted && errors.name">
      {{ $t('admin.users.validation.name') }}
    </small>
  </div>
  <div class="field">
    <label for="email">{{ $t('admin.users.email') }}</label>
    <InputText
      id="email"
      :model-value="user.email"
      required
      :class="{ 'p-invalid': submitted && errors.email }"
      @update:model-value="handleEmailUpdate"
    />
    <small class="p-invalid" v-if="submitted && errors.email">
      {{ $t('admin.users.validation.email') }}
    </small>
  </div>
  <template v-if="!user.id">
    <div class="field">
      <label for="password">{{ $t('admin.users.password') }}</label>
      <InputText
        id="password"
        type="password"
        v-model.trim="user.password"
        required
        :class="{ 'p-invalid': submitted && errors.password }"
      />
      <small class="p-invalid" v-if="submitted && errors.password">
        {{ $t('admin.users.validation.password') }}
      </small>
    </div>
    <div class="field">
      <label for="password-confirmation">{{
        $t('admin.users.passwordConfirmation')
      }}</label>
      <InputText
        id="password-confirmation"
        type="password"
        v-model.trim="user.passwordConfirmation"
        required
        :class="{ 'p-invalid': submitted && errors.passwordConfirmation }"
      />
      <small class="p-invalid" v-if="submitted && errors.passwordConfirmation">
        {{ $t('admin.users.validation.passwordConfirmation') }}
      </small>
    </div>
  </template>
  <div class="field">
    <label for="phone">{{ $t('admin.users.phone') }}</label>
    <InputText id="phone" v-model="user.phone" />
  </div>

  <div class="field-checkbox">
    <Checkbox
      id="admin"
      name="city"
      v-model="user.role"
      :false-value="USER_ROLES.PLAYER"
      :true-value="USER_ROLES.ADMIN"
      binary
    />
    <label for="admin">
      {{ $t('admin.users.administrator') }}
    </label>
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('common.status') }}</label>
    <BaseStatusPartialForm v-model="user.status" />
  </div>
</template>

<script setup>
import BaseStatusPartialForm from '@/components/Shared/BaseStatusPartialForm/BaseStatusPartialForm.vue'
import { reactive, watch } from 'vue'

import { USER_ROLES } from '@/constants/users'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue'])
const user = reactive(props.modelValue.value)

watch(
  user,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)

const handleEmailUpdate = (value) => (user.email = value.toLowerCase().trim())
</script>
