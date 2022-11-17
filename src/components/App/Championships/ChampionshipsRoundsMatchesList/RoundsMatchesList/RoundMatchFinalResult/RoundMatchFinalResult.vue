<template>
  <div class="flex justify-content-center">
    <InlineMessage severity="info" class="round-match-final-result">
      <div class="flex flex-column gap-1 align-items-center">
        <div class="flex gap-2 align-items-center">
          <span class="text-bold"> {{ $t('app.guesses.finalResult') }}: </span>
          <span :class="homeTeamRegularTimeClassName" class="flex gap-2">
            <span>{{ guess.match.homeTeam.name }}</span>
            {{ guess.match.regularTimeHomeTeamGoals }}
          </span>
          <span
            v-if="isPenaltiesRoundType"
            :class="homeTeamPenaltiesTimeClassName"
            class="flex gap-2"
          >
            ({{ guess.match.penaltiesTimeHomeTeamGoals }})
          </span>
          <span>X</span>
          <span
            v-if="isPenaltiesRoundType"
            :class="awayTeamPenaltiesTimeClassName"
          >
            ({{ guess.match.penaltiesTimeAwayTeamGoals }})
          </span>
          <span :class="awayTeamRegularTimeClassName" class="flex gap-2">
            <span>{{ guess.match.regularTimeAwayTeamGoals }}</span>
            {{ guess.match.awayTeam.name }}
          </span>
        </div>
        <small v-if="isPenaltiesRoundType">
          <em>{{ $t('app.guesses.afterPenalties') }}</em></small
        >
      </div>
    </InlineMessage>
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
  },
  homeTeamRegularTimeClassName: {
    type: String,
    default: ''
  },
  awayTeamRegularTimeClassName: {
    type: String,
    default: ''
  },
  homeTeamPenaltiesTimeClassName: {
    type: String,
    default: ''
  },
  awayTeamPenaltiesTimeClassName: {
    type: String,
    default: ''
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
</script>

<style lang="scss">
.round-match-final-result {
  .p-inline-message-icon {
    display: none;
  }
}
</style>
