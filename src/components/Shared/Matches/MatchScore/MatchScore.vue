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

    <div class="flex align-items-center justify-content-around gap-2">
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
  <!-- <div class="flex align-items-center gap-2">
    <div class="flex align-items-center gap-2">
      <span :class="homeTeamRegularTimeScoreClass">
        {{ match.homeTeam.name }}
      </span>
      <BadgeAvatar :image="match.homeTeam.badge" />
      <span :class="homeTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeHomeTeamGoals) }}
      </span>
    </div>
    <span class="pi pi-times font-small" />
    <div class="flex align-items-center gap-2">
      <span :class="awayTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeAwayTeamGoals) }}
      </span>
      <BadgeAvatar :image="match.awayTeam.badge" />
      <span :class="awayTeamRegularTimeScoreClass">
        {{ match.awayTeam.name }}
      </span>
    </div>
  </div> -->

  <!-- <div class="py-3 px-2 grid align-items-center">
    <div class="col">
      <div class="grid align-items-center justify-content-end">
        <div
          class="col-6 flex gap-2 justify-content-end align-items-center flex-column-reverse md:flex-row"
        >
          <span :class="homeTeamRegularTimeScoreClass">
            {{ match.homeTeam.name }}
          </span>
          <BadgeAvatar :image="match.homeTeam.badge" />
        </div>
        <span
          class="px-3 gap-2 flex font-large"
          :class="homeTeamRegularTimeScoreClass"
        >
          <span>
            {{ parseMatchGoals(match.regularTimeHomeTeamGoals) }}
          </span>
        </span>
      </div>
    </div>
    <div class="col-1 text-center width-auto pt-0">
      <span class="pi pi-times font-small" />
    </div>
    <div class="col">
      <div class="grid align-items-center">
        <span
          class="px-3 gap-2 flex font-large"
          :class="awayTeamRegularTimeScoreClass"
        >
          <span>
            {{ parseMatchGoals(match.regularTimeAwayTeamGoals) }}
          </span>
        </span>
        <div
          class="col-6 flex align-items-center justify-content-start gap-2 flex-column md:flex-row"
        >
          <BadgeAvatar :image="match.awayTeam.badge" />
          <span :class="awayTeamRegularTimeScoreClass">
            {{ match.awayTeam.name }}
          </span>
        </div>
      </div>
    </div>
  </div> -->
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
  ].includes(props.match.round.type)
)

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)
</script>
