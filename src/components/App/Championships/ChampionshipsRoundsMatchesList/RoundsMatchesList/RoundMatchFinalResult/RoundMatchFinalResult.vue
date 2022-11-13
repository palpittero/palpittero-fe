<template>
  <div class="flex justify-content-center">
    <InlineMessage severity="info" class="round-match-final-result">
      <div class="flex flex-column gap-3 align-items-center">
        <div class="flex gap-2 align-items-center">
          <span>
            {{ $t('app.guesses.finalResult') }}
          </span>
          <span :class="homeTeamClassName" class="flex gap-2">
            <span>{{ guess.match.homeTeam.name }}</span>
            {{ guess.match.regularTimeHomeTeamGoals }}
          </span>
          <span>X</span>
          <span :class="awayTeamClassName" class="flex gap-2">
            <span>{{ guess.match.regularTimeAwayTeamGoals }}</span>
            {{ guess.match.awayTeam.name }}
          </span>
        </div>
      </div>
    </InlineMessage>
  </div>
</template>

<script setup>
defineProps({
  guess: {
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

<style lang="scss">
.round-match-final-result {
  .p-inline-message-icon {
    display: none;
  }
}
</style>
