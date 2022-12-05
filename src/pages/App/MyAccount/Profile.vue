<template>
  <Breadcrumb v-bind="breadcrumb" class="mb-3" />
  <Profile />
</template>

<script setup>
import Profile from '@/components/App/MyAccount/Profile/Profile.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const breadcrumb = {
  home: {
    label: i18n.t('common.breadcrumb.home'),
    icon: 'pi pi-home',
    to: { name: 'Home' }
  },
  model: [
    {
      label: i18n.t('common.breadcrumb.myAccount')
    },
    {
      label: i18n.t('common.breadcrumb.myProfile')
    }
  ]
}
</script>
