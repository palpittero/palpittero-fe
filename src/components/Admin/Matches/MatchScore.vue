<script setup lang="ts">
import type { iMatch } from '@/types'
import { computed } from 'vue'
import BaseImage from '@/components/Shared/BaseImage.vue'
import { isNil } from 'lodash'

const props = defineProps<{
  match: iMatch
}>()

const regularTimeHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.match?.regularTimeHomeTeamGoals)),
)

const regularTimeAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.match?.regularTimeAwayTeamGoals)),
)

const penaltiesTimeHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.match?.penaltiesTimeHomeTeamGoals)),
)

const penaltiesTimeAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.match?.penaltiesTimeAwayTeamGoals)),
)

const isHomeTeamWinningRegularTime = computed<boolean>(
  () => regularTimeHomeTeamGoals.value > regularTimeAwayTeamGoals.value,
)

const isHomeTeamWinningPenalties = computed<boolean>(
  () => penaltiesTimeHomeTeamGoals.value > penaltiesTimeAwayTeamGoals.value,
)

const isAwayTeamWinningRegularTime = computed<boolean>(
  () => regularTimeAwayTeamGoals.value > regularTimeHomeTeamGoals.value,
)

const isAwayTeamWinningPenalties = computed<boolean>(
  () => penaltiesTimeAwayTeamGoals.value > penaltiesTimeHomeTeamGoals.value,
)

const isHomeTeamWinning = computed<boolean>(
  () => isHomeTeamWinningRegularTime.value || isHomeTeamWinningPenalties.value,
)

const isAwayTeamWinning = computed<boolean>(
  () => isAwayTeamWinningRegularTime.value || isAwayTeamWinningPenalties.value,
)

const isPenaltiesRound = computed<boolean>(() =>
  ['extraTime', 'penalties'].includes(props.match.round?.type || ''),
)

const formattedRegularTimeHomeTeamGoals = computed<string>(() =>
  formatMatchGoals(props.match.regularTimeHomeTeamGoals),
)

const formattedRegularTimeAwayTeamGoals = computed<string>(() =>
  formatMatchGoals(props.match.regularTimeAwayTeamGoals),
)

const formattedPenaltiesTimeHomeTeamGoals = computed<string>(() =>
  formatMatchGoals(props.match.penaltiesTimeHomeTeamGoals),
)

const formattedPenaltiesTimeAwayTeamGoals = computed<string>(() =>
  formatMatchGoals(props.match.penaltiesTimeAwayTeamGoals),
)

const formatMatchGoals = (goals: number | null | undefined): string =>
  isNil(goals) ? '' : String(goals)
</script>

<template>
  <div class="flex flex-col gap-2 min-w-36">
    <div class="flex justify-between items-center gap-2">
      <div class="flex items-center gap-2 w-full">
        <BaseImage :src="match.homeTeam?.badge" class="size-6 rounded-lg" />
        <span :class="{ 'font-bold': isHomeTeamWinning }">
          {{ match.homeTeam?.name }}
          <span v-if="isHomeTeamWinningPenalties"> * </span>
        </span>
      </div>
      <span
        v-if="match.regularTimeHomeTeamGoals"
        :class="{ 'font-bold': isHomeTeamWinningRegularTime }"
      >
        {{ formattedRegularTimeHomeTeamGoals }}
      </span>
      <span
        v-if="isPenaltiesRound && formattedPenaltiesTimeHomeTeamGoals"
        :class="{ 'font-bold': isHomeTeamWinningPenalties }"
      >
        ({{ formattedPenaltiesTimeHomeTeamGoals }})
      </span>
    </div>
    <div v-if="match.awayTeam" class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 w-full">
        <BaseImage :src="match.awayTeam?.badge" class="size-6 rounded-lg" />
        <span :class="{ 'font-bold': isAwayTeamWinning }">
          {{ match.awayTeam.name }}
          <span v-if="isAwayTeamWinningPenalties"> * </span>
        </span>
      </div>
      <span :class="{ 'font-bold': isAwayTeamWinningRegularTime }">
        {{ formattedRegularTimeAwayTeamGoals }}
      </span>
      <span
        v-if="isPenaltiesRound && formattedPenaltiesTimeAwayTeamGoals"
        :class="{ 'font-bold': isAwayTeamWinningPenalties }"
      >
        ({{ formattedPenaltiesTimeAwayTeamGoals }})
      </span>
    </div>
  </div>
</template>
