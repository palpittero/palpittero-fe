<template>
  <Breadcrumb v-bind="breadcrumb" class="mb-3" />
  <Championships />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Championships from '@/components/Admin/Championships/Championships.vue'

const i18n = useI18n()

const breadcrumb = {
  home: {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'pi pi-home mr-2',
    to: { name: 'AdminDashboard' }
  },
  model: [
    {
      label: i18n.t('common.breadcrumb.admin.championships')
    }
  ]
}
</script>
