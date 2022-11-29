<template>
  <Breadcrumb v-bind="breadcrumb" class="mb-3" />
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

const breadcrumb = ref({
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
})

const onUnprocessedGuessesReady = ({ league }) =>
  (breadcrumb.value.model = [
    {
      label: i18n.t('common.breadcrumb.admin.unprocessedGuesses'),
      to: { name: 'AdminUnprocessedGuessesLeagues' }
    },
    {
      label: league.name
    }
  ])
</script>
