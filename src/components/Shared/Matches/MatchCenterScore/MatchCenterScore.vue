<template>
  <div
    class="match-center-score flex align-items-center gap-3"
    :class="`justify-content-${align}`"
  >
    <div class="flex align-items-center justify-content-around gap-2">
      <div class="flex align-items-center gap-2 w-full">
        <BadgeAvatar
          v-if="match.homeTeam.badge"
          :image="match.homeTeam.badge"
        />
        <span :class="homeTeamRegularTimeScoreClass">
          {{ match.homeTeam.name }}
        </span>
      </div>
      <span :class="homeTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeHomeTeamGoals) }}
      </span>
      <span v-if="isPenaltiesRound" :class="homeTeamPenaltiesTimeScoreClass">
        ({{ parseMatchGoals(match.penaltiesTimeHomeTeamGoals) }})
      </span>
    </div>
    <span>X</span>
    <div class="flex align-items-center justify-content-around gap-2">
      <span v-if="isPenaltiesRound" :class="awayTeamPenaltiesTimeScoreClass">
        ({{ parseMatchGoals(match.penaltiesTimeAwayTeamGoals) }})
      </span>
      <span :class="awayTeamTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeAwayTeamGoals) }}
      </span>
      <div class="flex align-items-center gap-2 w-full">
        <span :class="awayTeamTeamRegularTimeScoreClass">
          {{ match.awayTeam.name }}
        </span>
        <BadgeAvatar
          v-if="match.awayTeam.badge"
          :image="match.awayTeam.badge"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { isNil } from 'lodash/fp'
import { computed } from 'vue'

import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'

const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['center', 'start'].includes(value)
  }
})

const homeTeamRegularTimeScoreClass = computed(
  () =>
    props.match?.regularTimeHomeTeamGoals >
      props.match?.regularTimeAwayTeamGoals && 'text-bold'
)

const awayTeamTeamRegularTimeScoreClass = computed(
  () =>
    props.match?.regularTimeAwayTeamGoals >
      props.match?.regularTimeHomeTeamGoals && 'text-bold'
)

const homeTeamPenaltiesTimeScoreClass = computed(
  () =>
    props.match?.penaltiesTimeHomeTeamGoals >
      props.match?.penaltiesTimeAwayTeamGoals && 'text-bold'
)

const awayTeamPenaltiesTimeScoreClass = computed(
  () =>
    props.match?.penaltiesTimeAwayTeamGoals >
      props.match?.penaltiesTimeHomeTeamGoals && 'text-bold'
)

const isPenaltiesRound = computed(() =>
  [
    CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
    CHAMPIONSHIPS_ROUND_TYPE.PENALTIES
  ].includes(props.match.round.type)
)

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)
</script>
