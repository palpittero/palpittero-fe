<template>
  <div class="flex justify-content-center pb-3">
    <InlineMessage severity="info" class="rounds-matches-list__final-result">
      <div class="flex flex-column gap-3 align-items-center">
        <div class="flex gap-2 align-items-center">
          <span>
            {{ $t('app.guesses.finalResult') }}
          </span>
          <span :class="homeTeamClassName" class="flex gap-2">
            <span>{{ matchGuess.homeTeam.name }}</span>
            {{ matchGuess.regularTimeHomeTeamGoals }}
          </span>
          <span class="pi pi-times font-small" />
          <span :class="awayTeamClassName" class="flex gap-2">
            <span>{{ matchGuess.regularTimeAwayTeamGoals }}</span>
            {{ matchGuess.awayTeam.name }}
          </span>
        </div>
      </div>
    </InlineMessage>
  </div>
</template>

<script setup>
defineProps({
  matchGuess: {
    type: Object,
    required: true
  },
  homeTeamClassName: {
    type: String,
    default: ''
  },
  awayTeamClassName: {
    type: String,
    default: ''
  }
})
</script>
