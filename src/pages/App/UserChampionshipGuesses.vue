<template>
  <AppLayout>
    <UserChampionshipGuesses
      :league-id="leagueId"
      :championship-id="championshipId"
    />
  </AppLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import AppLayout from '@/pages/App/AppLayout.vue'
import UserChampionshipGuesses from '@/components/Guesses/UserChampionshipGuesses/UserChampionshipGuesses.vue'

const route = useRoute()

const leagueId = computed(() => parseInt(route.params.leagueId))
const championshipId = computed(() => parseInt(route.params.championshipId))
</script>
