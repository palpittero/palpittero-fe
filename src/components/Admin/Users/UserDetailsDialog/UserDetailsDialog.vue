<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.users.userDetails')"
    @submit="onSubmit"
    @hide="emits('hide')"
  >
    <UserForm
      :model-value="props.modelValue"
      :submitted="submitted"
      :errors="errors"
    />
  </BaseDialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import UserForm from './UserForm/UserForm.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue', 'submit', 'hide'])

const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    phone: yup.string().nullable(),
    status: yup.string(),
    ...(props.modelValue.id
      ? {
          password: yup.string().required(),
          passwordConfirmation: yup
            .string()
            .required()
            .oneOf(
              [yup.ref('password')],
              i18n.t('admin.users.error.passwordsDontMatch')
            )
        }
      : {})
  })
})

watch(props.modelValue, (user) => setValues(user.value), { deep: true })

const onSubmit = handleSubmit(
  (user) => {
    submitted.value = true
    emits('submit', user)
  },
  () => (submitted.value = true)
)
</script>
