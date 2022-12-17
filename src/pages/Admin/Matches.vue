<template>
  <Breadcrumbs :items="breadcrumbs"  />
  <Matches />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Matches from '@/components/Admin/Matches/Matches.vue'

const i18n = useI18n()

const breadcrumbs = [
  {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'fas fa-home',
    to: { name: 'AdminDashboard' }
  },
  {
    label: i18n.t('common.breadcrumb.admin.matches')
  }
]
</script>
