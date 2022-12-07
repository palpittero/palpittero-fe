<template>
  <Breadcrumbs :items="breadcrumbs" class="mb-3" />
  <Profile />
</template>

<script setup>
import Profile from '@/components/App/MyAccount/Profile/Profile.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const breadcrumbs = [
  {
    label: i18n.t('common.breadcrumb.home'),
    icon: 'pi pi-home',
    to: { name: 'Home' }
  },
  {
    label: i18n.t('common.breadcrumb.myAccount'),
    active: true
  },
  {
    label: i18n.t('common.breadcrumb.myProfile'),
    active: true
  }
]
</script>
