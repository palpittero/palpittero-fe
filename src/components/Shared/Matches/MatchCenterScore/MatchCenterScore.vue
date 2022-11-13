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
        <span :class="homeTeamTeamScoreClass">
          {{ match.homeTeam.name }}
        </span>
      </div>
      <span :class="homeTeamTeamScoreClass">
        {{ parseMatchGoals(match.regularTimeHomeTeamGoals) }}
      </span>
    </div>
    <span>X</span>
    <div class="flex align-items-center justify-content-around gap-2">
      <span :class="awayTeamTeamScoreClass">
        {{ parseMatchGoals(match.regularTimeAwayTeamGoals) }}
      </span>
      <div class="flex align-items-center gap-2 w-full">
        <span :class="awayTeamTeamScoreClass">
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

const homeTeamTeamScoreClass = computed(
  () =>
    props.match?.regularTimeHomeTeamGoals >
      props.match?.regularTimeAwayTeamGoals && 'text-bold'
)

const awayTeamTeamScoreClass = computed(
  () =>
    props.match?.regularTimeAwayTeamGoals >
      props.match?.regularTimeHomeTeamGoals && 'text-bold'
)

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)
</script>
