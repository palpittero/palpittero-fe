<template>
  <div
    class="match-center-score flex align-items-center gap-3"
    :class="`justify-content-${align}`"
  >
    <div class="flex align-items-center justify-content-around gap-2">
      <div
        class="flex flex-column md:flex-row align-items-center justify-content-center gap-2 w-full"
      >
        <BadgeAvatar
          v-if="match.homeTeam.badge"
          class="flex-1 md:flex-auto"
          :image="match.homeTeam.badge"
        />
        <span class="text-center" :class="homeTeamRegularTimeScoreClass">
          {{ match.homeTeam.name }}
        </span>
      </div>
      <span v-if="isMatchFinished" :class="homeTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeHomeTeamGoals) }}
      </span>
      <span v-if="showPenaltiesScore" :class="homeTeamPenaltiesTimeScoreClass">
        ({{ parseMatchGoals(match.penaltiesTimeHomeTeamGoals) }})
      </span>
    </div>
    <span>X</span>
    <div class="flex align-items-center justify-content-around gap-2">
      <span v-if="showPenaltiesScore" :class="awayTeamPenaltiesTimeScoreClass">
        ({{ parseMatchGoals(match.penaltiesTimeAwayTeamGoals) }})
      </span>
      <span v-if="isMatchFinished" :class="awayTeamTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeAwayTeamGoals) }}
      </span>
      <div
        class="flex flex-column-reverse md:flex-row align-items-center justify-content-center gap-2 w-full"
      >
        <span class="text-center" :class="awayTeamTeamRegularTimeScoreClass">
          {{ match.awayTeam.name }}
        </span>
        <BadgeAvatar
          class="flex-1 md:flex-0"
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
import { MATCH_STATUSES } from '@/constants/matches'

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

const isMatchFinished = computed(
  () => props.match.status === MATCH_STATUSES.FINISHED
)

const showPenaltiesScore = computed(
  () => isPenaltiesRound.value && isMatchFinished.value
)

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)
</script>
