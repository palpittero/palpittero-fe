<script setup lang="ts">
import type { iGuess } from '@/types'
import MatchScore from '../Matches/MatchScore.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'

defineProps<{
  guess: iGuess
}>()
</script>

<template>
  <li class="list-row flex flex-col rounded-box shadow-md lg:w-1/2">
    <div class="text-xs tracking-wide font-bold flex items-center gap-2">
      <BaseImage :src="guess.user.avatar ?? ''" class="size-5" />
      {{ guess.user.name }}
    </div>
    <div class="flex flex-col lg:flex-row gap-4 lg:items-center">
      <div class="flex flex-1 flex-col">
        <div class="text-xs uppercase font-semibold opacity-70">
          {{ guess.match.round?.name }}
        </div>

        <span class="text-xs opacity-70">
          <FormattedDate :date="guess.match.date!" />
        </span>
        <div class="badge badge-success badge-sm badge-soft">Concluída</div>
      </div>
      <div class="divider divider-horizontal flex lg:hidden" />
      <div class="w-full flex-1 lg:w-auto">
        <MatchScore
          :match="{
            ...guess.match,
            regularTimeHomeTeamGoals: guess.homeTeamRegularTimeGoals,
            regularTimeAwayTeamGoals: guess.awayTeamRegularTimeGoals,
            penaltiesTimeHomeTeamGoals: guess.homeTeamPenaltiesTimeGoals,
            penaltiesTimeAwayTeamGoals: guess.awayTeamPenaltiesTimeGoals,
          }"
        />
      </div>
    </div>
  </li>
</template>
