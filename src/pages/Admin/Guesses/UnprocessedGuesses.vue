<template>
  <UnprocessedGuesses :leagueId="leagueId" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnprocessedGuesses from '@/components/Admin/Guesses/UnprocessedGuesses/UnprocessedGuesses.vue'

const route = useRoute()

const leagueId = computed(() => parseInt(route.params.leagueId))
</script>
