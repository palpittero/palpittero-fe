<template>
  <Breadcrumbs :items="breadcrumbs" class="mb-3" />
  <Teams />
</template>

<script setup>
import Teams from '@/components/Admin/Teams/Teams.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const breadcrumbs = [
  {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'pi pi-home',
    to: { name: 'AdminDashboard' }
  },
  {
    label: i18n.t('common.breadcrumb.admin.teams')
  }
]
</script>
