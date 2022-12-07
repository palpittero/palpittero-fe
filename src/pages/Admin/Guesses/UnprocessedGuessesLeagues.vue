<template>
  <Breadcrumbs :items="breadcrumbs" class="mb-3" />
  <UnprocessedGuessesLeagues />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import UnprocessedGuessesLeagues from '@/components/Admin/Guesses/UnprocessedGuessesLeagues/UnprocessedGuessesLeagues.vue'

const i18n = useI18n()

const breadcrumbs = [
  {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'pi pi-home',
    to: { name: 'AdminDashboard' }
  },
  {
    label: i18n.t('common.breadcrumb.admin.unprocessedGuesses')
  }
]
</script>
