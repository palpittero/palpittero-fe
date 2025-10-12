<script setup lang="ts">
import BaseImage from '@/components/Shared/BaseImage.vue'
import type { iGuess, iMatch } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  guess: iGuess
  match: iMatch
  leagueId: number
}>()

const homeTeamRegularTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamRegularTimeGoals)),
)

const awayTeamRegularTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamRegularTimeGoals)),
)

const homeTeamPenaltiesTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamPenaltiesTimeGoals)),
)

const awayTeamPenaltiesTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamPenaltiesTimeGoals)),
)

const isGuessHomeTeamWinningRegularTime = computed<boolean>(
  () => homeTeamRegularTimeGoals.value > awayTeamRegularTimeGoals.value,
)

const isGuessHomeTeamWinningPenalties = computed<boolean>(
  () => homeTeamPenaltiesTimeGoals.value > awayTeamPenaltiesTimeGoals.value,
)

const isHomeTeamWinning = computed<boolean>(
  () => isGuessHomeTeamWinningRegularTime.value || isGuessHomeTeamWinningPenalties.value,
)

const isGuessAwayTeamWinningRegularTime = computed<boolean>(
  () => awayTeamRegularTimeGoals.value > homeTeamRegularTimeGoals.value,
)

const isGuessAwayTeamWinningPenalties = computed<boolean>(
  () => awayTeamPenaltiesTimeGoals.value > homeTeamPenaltiesTimeGoals.value,
)

const isAwayTeamWinning = computed<boolean>(
  () => isGuessAwayTeamWinningRegularTime.value || isGuessAwayTeamWinningPenalties.value,
)

const hasPenaltiesGuess = computed<boolean>(
  () => !isNaN(homeTeamPenaltiesTimeGoals.value) && !isNaN(awayTeamPenaltiesTimeGoals.value),
)
</script>

<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <div class="flex flex-col gap-4 lg:flex-row items-start">
        <div class="flex items-center gap-3">
          <BaseImage :src="guess.user.avatar" :alt="guess.user.name" class="size-8 rounded-lg" />
          <div>
            <div class="font-medium">{{ guess.user?.name }}</div>
            <div v-if="guess.points" class="badge badge-success badge-sm">
              <i class="fa-solid fa-star" />
              {{ guess.points }} pontos
            </div>
          </div>
        </div>
        <div class="w-full flex-1 rounded-box bg-base-200 px-4 py-2 text-xs flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <div class="font-medium">Tempo Regular</div>
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
                    class="text-right"
                    :class="{
                      'font-bold': isHomeTeamWinning,
                    }"
                  >
                    {{ match.homeTeam?.name }}
                    <span class="font-bold" v-if="isGuessHomeTeamWinningPenalties"> * </span>
                  </span>
                </div>
                <div class="flex gap-1">
                  <span
                    class="w-12 text-right"
                    :class="{ 'font-bold': isGuessHomeTeamWinningRegularTime }"
                    disabled
                    >{{ guess.homeTeamRegularTimeGoals ?? '-' }}</span
                  >
                </div>
              </div>

              <!-- Away team -->
              <div class="flex gap-2 items-center w-full justify-between">
                <div class="flex items-center justify-start gap-2">
                  <BaseImage
                    :src="match.awayTeam?.badge"
                    :alt="match.awayTeam?.name"
                    class="size-6 rounded-lg border border-base-300"
                  />
                  <span
                    class="text-left"
                    :class="{
                      'font-bold': isAwayTeamWinning,
                    }"
                  >
                    {{ match.awayTeam?.name }}
                    <span class="font-bold" v-if="isGuessAwayTeamWinningPenalties"> * </span>
                  </span>
                </div>
                <div class="flex gap-1">
                  <span
                    class="w-12 text-right"
                    :class="{ 'font-bold': isGuessAwayTeamWinningRegularTime }"
                    disabled
                  >
                    {{ guess.awayTeamRegularTimeGoals ?? '-' }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Penalties -->
          <div v-if="hasPenaltiesGuess" class="flex flex-col">
            <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
            <div class="flex justify-center gap-2 items-center">
              <div
                class="border-base-300 col-span-2 flex items-center justify-around gap-1 col-start-6"
              >
                <BaseImage
                  :src="match.homeTeam?.badge"
                  :alt="match.homeTeam?.name"
                  class="size-6 rounded-lg border border-base-300"
                />
                <span
                  class="w-8 text-center"
                  :class="{ 'font-bold': isGuessHomeTeamWinningPenalties }"
                >
                  {{ guess.homeTeamPenaltiesTimeGoals ?? '-' }}
                </span>
                <i class="fa-solid fa-xmark text-base-content/60 text-xs" />
                <span
                  class="w-8 text-center"
                  :class="{ 'font-bold': isGuessAwayTeamWinningPenalties }"
                >
                  {{ guess.awayTeamPenaltiesTimeGoals ?? '-' }}
                </span>
                <BaseImage
                  :src="match.awayTeam?.badge"
                  :alt="match.awayTeam?.name"
                  class="size-6 rounded-lg border border-base-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
