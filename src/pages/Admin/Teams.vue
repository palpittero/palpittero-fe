<template>
  <Breadcrumb v-bind="breadcrumb" class="mb-3" />
  <Teams />
</template>

<script setup>
import Teams from '@/components/Admin/Teams/Teams.vue'
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
      label: i18n.t('common.breadcrumb.admin.teams')
    }
  ]
}
</script>
