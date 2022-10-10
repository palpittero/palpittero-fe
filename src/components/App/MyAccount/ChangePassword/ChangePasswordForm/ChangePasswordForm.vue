<template>
  <div class="field">
    <label for="name">{{
      $t('app.myAccount.changePassword.currentPassword')
    }}</label>
    <InputText
      id="currentPassword"
      v-model.trim="user.currentPassword"
      type="password"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.currentPassword }"
    />
    <small class="p-invalid" v-if="submitted && errors.currentPassword">
      {{ $t('app.myAccount.changePassword.validation.currentPassword') }}
    </small>
  </div>
  <div class="field">
    <label for="email">{{
      $t('app.myAccount.changePassword.newPassword')
    }}</label>
    <InputText
      id="newPassword"
      v-model.trim="user.newPassword"
      type="password"
      required
      :class="{ 'p-invalid': submitted && errors.newPassword }"
    />
    <small class="p-invalid" v-if="submitted && errors.newPassword">
      {{ $t('app.myAccount.changePassword.validation.newPassword') }}
    </small>
  </div>
  <div class="field">
    <label for="email">{{
      $t('app.myAccount.changePassword.newPasswordConfirmation')
    }}</label>
    <InputText
      id="newPasswordConfirmation"
      v-model.trim="user.newPasswordConfirmation"
      type="password"
      required
      :class="{ 'p-invalid': submitted && errors.newPasswordConfirmation }"
    />
    <small class="p-invalid" v-if="submitted && errors.newPasswordConfirmation">
      {{
        $t('app.myAccount.changePassword.validation.newPasswordConfirmation')
      }}
    </small>
  </div>
  <div class="flex justify-content-end">
    <Button
      :label="$t('common.menu.myAccount.changePassword')"
      icon="pi pi-check"
      @click="onSubmit"
      :disabled="loading"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  loading: Boolean
})

const submitted = ref(false)
const user = ref(props.user)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    currentPassword: yup.string().required(),
    newPassword: yup.string().required(),
    newPasswordConfirmation: yup
      .string()
      .required()
      .oneOf(
        [yup.ref('newPassword')],
        i18n.t('admin.users.error.passwordsDontMatch')
      )
  })
})

watch(user, (user) => setValues(user), { deep: true, immediate: true })

const emits = defineEmits(['update:modelValue', 'submit'])

const onSubmit = handleSubmit(
  (user) => {
    submitted.value = true
    emits('submit', user)
  },
  () => (submitted.value = true)
)
</script>
