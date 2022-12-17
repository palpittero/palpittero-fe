<template>
  <AppLayout>
    <Breadcrumbs :items="breadcrumbs" />
    <Guesses :league-id="leagueId" @ready="onGuessesReady" />
  </AppLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

import AppLayout from '@/pages/App/AppLayout.vue'
import Guesses from '@/components/Guesses/Guesses.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const i18n = useI18n()

const leagueId = computed(() => parseInt(route.params.leagueId))

const breadcrumbs = ref([])

const onGuessesReady = ({ league }) =>
  (breadcrumbs.value = [
    {
      label: i18n.t('common.breadcrumb.home'),
      icon: 'fas fa-home',
      to: { name: 'Home' }
    },
    {
      label: league.name
    },
    {
      label: i18n.t('common.breadcrumb.guesses')
    }
  ])
</script>
