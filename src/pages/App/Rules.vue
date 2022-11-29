<template>
  <AppLayout>
    <Breadcrumb
      :home="breadcrumb.home"
      :model="breadcrumb.model"
      aria-label="breadcrumb"
    />
    <Heading :label="$t('common.menu.rules')" icon="pi pi-book" />
    <Rules />
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import AppLayout from '@/pages/App/AppLayout.vue'
import Heading from '@/components/Shared/Heading/Heading.vue'
import Rules from '@/components/App/Rules/Rules.vue'

const i18n = useI18n()

const breadcrumb = {
  home: {
    label: i18n.t('common.breadcrumb.home'),
    icon: 'pi pi-home mr-2',
    to: { name: 'Home' }
  },
  model: [
    {
      label: i18n.t('common.breadcrumb.rules')
    }
  ]
}
</script>
