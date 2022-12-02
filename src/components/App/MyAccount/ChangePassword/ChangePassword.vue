<template>
  <h1>
    {{ $t('common.menu.myAccount.changePassword') }}
  </h1>
  <div class="surface-section p-5">
    <ChangePasswordForm
      :user="user.data"
      @submit="handleSubmit"
      :loading="isSaving"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import services from '@/services'

import ChangePasswordForm from './ChangePasswordForm/ChangePasswordForm.vue'

const toast = useToast()
const i18n = useI18n()

const user = ref({
  loading: true,
  error: null,
  data: {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
  }
})

const isSaving = ref(false)

const handleSubmit = async ({ currentPassword, newPassword }) => {
  try {
    isSaving.value = true
    await services.auth.updatePassword({ currentPassword, newPassword })

    toast(i18n.t('app.myAccount.changePassword.saved'))
  } catch (error) {
    if (error.response.status === 400) {
      toast.error(i18n.t('app.myAccount.changePassword.error.currentPassword'))
    }
  } finally {
    isSaving.value = false
  }
}
</script>
