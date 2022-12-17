<template>
  <div class="d-flex justify-content-center">
    <PAlert
      variant="info"
      :icon="null"
      class="d-flex flex-column align-items-center py-1 px-3"
    >
      <small> {{ $t('app.guesses.finalResult') }}</small>
      <div class="d-flex gap-1 align-items-center">
        <span :class="homeTeamRegularTimeClass" class="flex gap-1">
          <span>{{ guess.match.homeTeam.name }}</span>
          {{ guess.match.regularTimeHomeTeamGoals }}
        </span>
        <span
          v-if="isPenaltiesRoundType"
          :class="homeTeamPenaltiesTimeClass"
          class="d-flex gap-1 align-items-center"
        >
          ({{ guess.match.penaltiesTimeHomeTeamGoals }})
        </span>
        <font-awesome-icon icon="fas fa-times" />
        <span v-if="isPenaltiesRoundType" :class="awayTeamPenaltiesTimeClass">
          ({{ guess.match.penaltiesTimeAwayTeamGoals }})
        </span>
        <span
          :class="awayTeamRegularTimeClass"
          class="d-flex gap-1 align-items-center"
        >
          <span>{{ guess.match.regularTimeAwayTeamGoals }}</span>
          {{ guess.match.awayTeam.name }}
        </span>
      </div>
      <small v-if="isPenaltiesRoundType">
        <em>{{ $t('app.guesses.afterPenalties') }}</em></small
      >
    </PAlert>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isNil } from 'lodash/fp'

import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'

const props = defineProps({
  guess: {
    type: Object,
    required: true
  }
})

const isPenaltiesRoundType = computed(
  () =>
    [
      CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
      CHAMPIONSHIPS_ROUND_TYPE.PENALTIES
    ].includes(props.guess.match.round.type) &&
    !isNil(props.guess.match.penaltiesTimeHomeTeamGoals) &&
    !isNil(props.guess.match.penaltiesTimeAwayTeamGoals)
)

const homeTeamRegularTimeClass = computed(() => [
  props.guess.match.regularTimeHomeTeamGoals >
    props.guess.match.regularTimeAwayTeamGoals && 'text-bold'
])

const awayTeamRegularTimeClass = computed(() => [
  props.guess.match.regularTimeAwayTeamGoals >
    props.guess.match.regularTimeHomeTeamGoals && 'text-bold'
])

const homeTeamPenaltiesTimeClass = computed(() => [
  props.guess.match.penaltiesTimeHomeTeamGoals >
    props.guess.match.penaltiesTimeAwayTeamGoals && 'text-bold'
])

const awayTeamPenaltiesTimeClass = computed(() => [
  props.guess.match.penaltiesTimeAwayTeamGoals >
    props.guess.match.penaltiesTimeHomeTeamGoals && 'text-bold'
])
</script>

<style lang="scss">
.round-match-final-result {
  .p-inline-message-icon {
    display: none;
  }
}
</style>
