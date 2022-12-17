<template>
  <Breadcrumbs :items="breadcrumbs" />
  <Championships />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Championships from '@/components/Admin/Championships/Championships.vue'

const i18n = useI18n()

const breadcrumbs = [
  {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'fas fa-home',
    to: { name: 'AdminDashboard' }
  },
  {
    label: i18n.t('common.breadcrumb.admin.championships')
  }
]
</script>
