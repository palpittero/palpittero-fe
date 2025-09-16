<script setup lang="ts">
import type { iMatch } from '@/types'
import { isNil } from 'lodash/fp'
import { computed } from 'vue'
import BaseImage from '../BaseImage.vue'

const props = defineProps<{
  match: iMatch
}>()

const homeTeamRegularTimeScoreClass = computed<string>(() =>
  Number(props.match?.regularTimeHomeTeamGoals) > Number(props.match?.regularTimeAwayTeamGoals)
    ? 'font-bold'
    : '',
)

const awayTeamRegularTimeScoreClass = computed<string>(() =>
  Number(props.match?.regularTimeAwayTeamGoals) > Number(props.match?.regularTimeHomeTeamGoals)
    ? 'font-bold'
    : '',
)

const homeTeamPenaltiesTimeScoreClass = computed<string>(() =>
  Number(props.match?.penaltiesTimeHomeTeamGoals) > Number(props.match?.penaltiesTimeAwayTeamGoals)
    ? 'font-bold'
    : '',
)

const awayTeamPenaltiesTimeScoreClass = computed<string>(() =>
  Number(props.match?.penaltiesTimeAwayTeamGoals) > Number(props.match?.penaltiesTimeHomeTeamGoals)
    ? 'font-bold'
    : '',
)

const isPenaltiesRound = computed<boolean>(() =>
  ['extraTime', 'penalties'].includes(props.match.round?.type || ''),
)

const parseMatchGoals = (goals?: number | null): string => (isNil(goals) ? '-' : String(goals))
</script>

<template>
  <div class="flex flex-col gap-2 min-w-36">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <BaseImage :src="match.homeTeam?.badge" class="size-6" />
        <span :class="homeTeamRegularTimeScoreClass">{{ match.homeTeam?.name }}</span>
      </div>
      <span :class="homeTeamRegularTimeScoreClass">
        {{ parseMatchGoals(match.regularTimeHomeTeamGoals) }}
      </span>
      <span v-if="isPenaltiesRound" :class="homeTeamPenaltiesTimeScoreClass">
        ({{ parseMatchGoals(match.penaltiesTimeHomeTeamGoals) }})
      </span>
    </div>
    <div v-if="match.awayTeam" class="flex items-center justify-around gap-2">
      <div class="flex items-center gap-2 w-full">
        <BaseImage :src="match.awayTeam?.badge" class="size-6" />
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
