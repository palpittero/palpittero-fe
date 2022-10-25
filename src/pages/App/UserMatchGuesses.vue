<template>
  <AppLayout>
    <UserMatchGuesses :league-id="leagueId" :match-id="matchId" />
  </AppLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import AppLayout from '@/pages/App/AppLayout.vue'
import UserMatchGuesses from '@/components/Guesses/UserMatchGuesses/UserMatchGuesses.vue'

const route = useRoute()

const leagueId = computed(() => parseInt(route.params.leagueId))
const matchId = computed(() => parseInt(route.params.matchId))
</script>
