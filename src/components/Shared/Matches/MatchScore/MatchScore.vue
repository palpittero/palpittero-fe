<template>
  <div class="match-score flex flex-column gap-3">
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

    <div
      v-if="match.awayTeam"
      class="flex align-items-center justify-content-around gap-2"
    >
      <div class="flex align-items-center gap-2 w-full">
        <BadgeAvatar
          v-if="match.awayTeam.badge"
          :image="match.awayTeam.badge"
        />
        <span :class="awayTeamRegularTimeScoreClass">
          {{ match.awayTeam.name }}
        </span>
      </div>
      <span :class="awayTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeAwayTeamGoals) }}
      </span>
      <span v-if="isPenaltiesRound" :class="awayTeamPenaltiesTimeScoreClass">
        ({{ parseMatchGoals(match.penaltiesTimeAwayTeamGoals) }})
      </span>
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
  }
})

const homeTeamRegularTimeScoreClass = computed(
  () =>
    props.match?.regularTimeHomeTeamGoals >
      props.match?.regularTimeAwayTeamGoals && 'text-bold'
)

const awayTeamRegularTimeScoreClass = computed(
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
  ].includes(props.match.round?.type)
)

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)
</script>
