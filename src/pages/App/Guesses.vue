<template>
  <AppLayout>
    <Breadcrumb
      :home="breadcrumb.home"
      :model="breadcrumb.model"
      aria-label="breadcrumb"
    />
    <Guesses :league-id="leagueId" @ready="onGuessesReady" />
  </AppLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

import AppLayout from '@/pages/App/AppLayout.vue'
import Guesses from '@/components/Guesses/Guesses.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()

const i18n = useI18n()

const breadcrumb = ref({
  home: {
    label: i18n.t('common.breadcrumb.home'),
    icon: 'pi pi-home',
    to: { name: 'Home' }
  },
  model: []
})

const leagueId = computed(() => Number(route.params.leagueId))

const onGuessesReady = ({ league }) =>
  (breadcrumb.value.model = [
    {
      label: league.name
    },
    {
      label: i18n.t('common.breadcrumb.guesses')
    }
  ])
</script>
