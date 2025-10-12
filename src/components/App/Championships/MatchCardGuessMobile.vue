<script setup lang="ts">
import type { iMatch, iMatchGuess } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'

defineProps<{
  match: iMatch
  isHomeTeamWinning: boolean
  isAwayTeamWinning: boolean
  isHomeTeamWinningRegularTime: boolean
  isAwayTeamWinningRegularTime: boolean
  isHomeTeamWinningPenalties: boolean
  isAwayTeamWinningPenalties: boolean
  allowPenaltiesGuess: boolean
}>()

const guess = defineModel<iMatchGuess>({ required: true })

const emit = defineEmits<{
  'update-guess': []
}>()

const handleUpdateGuess = () => {
  emit('update-guess')
}
</script>

<template>
  <div class="flex lg:hidden flex-col gap-4">
    <!-- Teams and scores -->
    <div class="flex flex-col gap-2">
      <div class="text-center text-xs font-medium">Tempo Regular</div>
      <div class="flex flex-col items-start gap-2">
        <!-- Home team -->
        <div class="flex gap-2 items-center w-full justify-between">
          <div class="flex items-center justify-end gap-2">
            <BaseImage
              :src="match.homeTeam?.badge"
              :alt="match.homeTeam?.name"
              class="size-6 rounded-lg border border-base-300"
            />
            <span
              class="text-sm md:text-base text-right"
              :class="{ 'font-bold': isHomeTeamWinning }"
            >
              {{ match.homeTeam?.name }}
              <span class="font-bold" v-if="isHomeTeamWinningPenalties"> * </span>
            </span>
          </div>
          <input
            v-model="guess.homeTeamRegularTimeGoals"
            type="number"
            min="0"
            step="1"
            class="input !w-12 text-center"
            :class="{ 'font-bold': isHomeTeamWinningRegularTime }"
            @input="handleUpdateGuess"
          />
        </div>

        <div class="flex gap-2 items-center w-full justify-between">
          <div class="flex items-center justify-start gap-2">
            <BaseImage
              :src="match.awayTeam?.badge"
              :alt="match.awayTeam?.name"
              class="size-6 rounded-lg border border-base-300"
            />
            <span
              class="text-sm md:text-base text-left"
              :class="{ 'font-bold': isAwayTeamWinning }"
            >
              {{ match.awayTeam?.name }}
              <span class="font-bold" v-if="isAwayTeamWinningPenalties"> * </span>
            </span>
          </div>
          <div class="flex gap-1">
            <input
              v-model="guess.awayTeamRegularTimeGoals"
              type="number"
              min="0"
              step="1"
              class="input !w-12 text-center"
              :class="{ 'font-bold': isAwayTeamWinningRegularTime }"
              @input="handleUpdateGuess"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="allowPenaltiesGuess"
      class="w-full bg-base-200/50 pt-2 px-3 pb-4 rounded-box self-center"
    >
      <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
      <div class="flex items-center gap-2 justify-center">
        <BaseImage
          :src="match.homeTeam?.badge"
          :alt="match.homeTeam?.name"
          class="size-6 rounded-lg border border-base-300"
        />
        <input
          v-model="guess.homeTeamPenaltiesTimeGoals"
          type="number"
          min="0"
          step="1"
          class="input !w-12 text-center"
          :class="{ 'font-bold': isHomeTeamWinningPenalties }"
        />
        <i class="fa-solid fa-xmark text-base-content/60" />
        <input
          v-model="guess.awayTeamPenaltiesTimeGoals"
          type="number"
          min="0"
          step="1"
          class="input !w-12 text-center"
          :class="{ 'font-bold': isAwayTeamWinningPenalties }"
        />
        <BaseImage
          :src="match.awayTeam?.badge"
          :alt="match.awayTeam?.name"
          class="size-6 rounded-lg border border-base-300"
        />
      </div>
    </div>
  </div>
</template>
