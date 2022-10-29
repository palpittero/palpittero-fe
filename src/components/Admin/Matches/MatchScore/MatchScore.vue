<template>
  <div class="match-score flex gap-1">
    <span :class="{ 'match-score__winner': isHomeTeamWinner }">
      {{ match.homeTeam.name }} {{ match.regularTimeHomeTeamGoals }}
    </span>
    <span>x</span>
    <span :class="{ 'match-score__winner': isAwayTeamWinner }">
      {{ match.regularTimeAwayTeamGoals }} {{ match.awayTeam.name }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MATCH_RESULTS } from '@/constants/matches'

const props = defineProps({
  match: {
    type: Object,
    required: true
  }
})

const isHomeTeamWinner = computed(
  () => props.match.result === MATCH_RESULTS.HOME_TEAM_REGULAR_TIME_WIN
)
const isAwayTeamWinner = computed(
  () => props.match.result === MATCH_RESULTS.AWAY_TEAM_REGULAR_TIME_WIN
)
</script>

<style lang="scss" scoped>
.match-score__winner {
  font-weight: bold;
}
</style>
