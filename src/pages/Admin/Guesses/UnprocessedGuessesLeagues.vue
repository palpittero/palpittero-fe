<template>
  <Breadcrumb v-bind="breadcrumb" class="mb-3" />
  <UnprocessedGuessesLeagues />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import UnprocessedGuessesLeagues from '@/components/Admin/Guesses/UnprocessedGuessesLeagues/UnprocessedGuessesLeagues.vue'

const i18n = useI18n()

const breadcrumb = {
  home: {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'pi pi-home mr-2',
    to: { name: 'AdminDashboard' }
  },
  model: [
    {
      label: i18n.t('common.breadcrumb.admin.unprocessedGuesses')
    }
  ]
}
</script>
