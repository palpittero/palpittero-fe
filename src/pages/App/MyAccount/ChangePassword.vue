<template>
  <Breadcrumb v-bind="breadcrumb" />
  <ChangePassword />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ChangePassword from '@/components/App/MyAccount/ChangePassword/ChangePassword.vue'

const i18n = useI18n()

const breadcrumb = {
  home: {
    label: i18n.t('common.breadcrumb.home'),
    icon: 'pi pi-home mr-2',
    to: { name: 'Home' }
  },
  model: [
    {
      label: i18n.t('common.breadcrumb.myAccount')
    },
    {
      label: i18n.t('common.breadcrumb.changePassword')
    }
  ]
}
</script>
