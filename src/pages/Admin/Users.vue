<template>
  <Breadcrumb v-bind="breadcrumb" class="mb-3" />
  <Users />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Users from '@/components/Admin/Users/Users.vue'

const i18n = useI18n()

const breadcrumb = {
  home: {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'pi pi-home',
    to: { name: 'AdminDashboard' }
  },
  model: [
    {
      label: i18n.t('common.breadcrumb.admin.users')
    }
  ]
}
</script>
