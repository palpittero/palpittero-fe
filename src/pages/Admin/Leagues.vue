<template>
  <Breadcrumb v-bind="breadcrumb" class="mb-3" />
  <Leagues />
</template>

<script setup>
import Leagues from '@/components/Admin/Leagues/Leagues.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const breadcrumb = {
  home: {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'pi pi-home mr-2',
    to: { name: 'AdminDashboard' }
  },
  model: [
    {
      label: i18n.t('common.breadcrumb.admin.leagues')
    }
  ]
}
</script>
