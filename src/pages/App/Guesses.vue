<template>
  <AppLayout>
    <Guesses :league-id="leagueId" />
  </AppLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import AppLayout from '@/pages/App/AppLayout.vue'
import Guesses from '@/components/Guesses/Guesses.vue'

const route = useRoute()

const leagueId = computed(() => parseInt(route.params.leagueId))
</script>
