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
import { useToast } from 'primevue/usetoast'
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

    toast.add({
      group: 'app',
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('app.myAccount.changePassword.saved'),
      life: 4000
    })
  } catch (error) {
    console.log(error)
    if (error.response.status === 400) {
      toast.add({
        group: 'app',
        severity: 'error',
        summary: i18n.t('common.error'),
        detail: i18n.t('app.myAccount.changePassword.error.currentPassword'),
        life: 4000
      })
    }
  } finally {
    isSaving.value = false
  }
}
</script>
