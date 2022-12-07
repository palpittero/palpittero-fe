<template>
  <Breadcrumbs :items="breadcrumbs" />
  <ChangePassword />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ChangePassword from '@/components/App/MyAccount/ChangePassword/ChangePassword.vue'

const i18n = useI18n()

const breadcrumbs = [
  {
    label: i18n.t('common.breadcrumb.home'),
    icon: 'pi pi-home',
    to: { name: 'Home' }
  },
  {
    label: i18n.t('common.breadcrumb.myAccount')
  },
  {
    label: i18n.t('common.breadcrumb.changePassword')
  }
]
</script>
