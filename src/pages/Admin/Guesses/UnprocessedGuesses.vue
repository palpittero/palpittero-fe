<template>
  <Breadcrumbs :items="breadcrumbs" class="mb-3" />
  <UnprocessedGuesses :leagueId="leagueId" @ready="onUnprocessedGuessesReady" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UnprocessedGuesses from '@/components/Admin/Guesses/UnprocessedGuesses/UnprocessedGuesses.vue'

const route = useRoute()
const i18n = useI18n()

const leagueId = computed(() => parseInt(route.params.leagueId))

const breadcrumbs = ref([
  {
    label: i18n.t('common.breadcrumb.admin.dashboard'),
    icon: 'pi pi-home',
    to: { name: 'AdminDashboard' }
  },
  {
    label: i18n.t('common.breadcrumb.admin.unprocessedGuesses')
  }
])

const onUnprocessedGuessesReady = ({ league }) =>
  (breadcrumbs.value = [
    {
      label: i18n.t('common.breadcrumb.admin.unprocessedGuesses'),
      to: { name: 'AdminUnprocessedGuessesLeagues' }
    },
    {
      label: league.name
    }
  ])
</script>
