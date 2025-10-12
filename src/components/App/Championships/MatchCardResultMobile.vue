<script setup lang="ts">
import type { iMatch, iMatchGuess } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'

defineProps<{
  // Guess
  guess: iMatchGuess
  isGuessHomeTeamWinningRegularTime: boolean
  isGuessAwayTeamWinningRegularTime: boolean
  isGuessHomeTeamWinningPenalties: boolean
  isGuessAwayTeamWinningPenalties: boolean
  isGuessHomeTeamWinning: boolean
  isGuessAwayTeamWinning: boolean
  hasPenaltiesGuess: boolean
  // Match
  match: iMatch
  isMatchHomeTeamWinningRegularTime: boolean
  isMatchAwayTeamWinningRegularTime: boolean
  isMatchHomeTeamWinningPenalties: boolean
  isMatchAwayTeamWinningPenalties: boolean
  isMatchHomeTeamWinning: boolean
  isMatchAwayTeamWinning: boolean
  matchResultText: string
  hasMatchPenalties: boolean
  matchHasResult: boolean
}>()
</script>

<template>
  <div class="flex lg:hidden flex-col gap-2">
    <!-- Teams and scores -->
    <div class="flex flex-col gap-2">
      <div class="text-center text-xs font-medium">Tempo Regular</div>
      <div class="flex flex-col items-start gap-2">
        <span v-if="match?.group" class="badge badge-xs badge-outline border-base-300">
          {{ match?.group?.name }}
        </span>
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
              :class="{
                'font-bold': isGuessHomeTeamWinning,
              }"
            >
              {{ match.homeTeam?.name }}
              <span class="font-bold" v-if="isGuessHomeTeamWinningPenalties"> * </span>
            </span>
          </div>
          <div class="flex gap-1">
            <span
              class="w-12 text-center"
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
              class="text-sm md:text-base text-left"
              :class="{
                'font-bold': isGuessAwayTeamWinning,
              }"
            >
              {{ match.awayTeam?.name }}
              <span class="font-bold" v-if="isGuessAwayTeamWinningPenalties"> * </span>
            </span>
          </div>
          <div class="flex gap-1">
            <span
              class="w-12 text-center"
              :class="{ 'font-bold': isGuessAwayTeamWinningRegularTime }"
              disabled
            >
              {{ guess.awayTeamRegularTimeGoals ?? '-' }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasPenaltiesGuess" class="flex flex-col gap-2">
      <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
      <div class="flex justify-center gap-2 items-center">
        <div class="col-span-2 flex items-center justify-around gap-2 col-start-6">
          <span class="w-12 text-center" :class="{ 'font-bold': isGuessHomeTeamWinningPenalties }">
            {{ guess.homeTeamPenaltiesTimeGoals ?? '-' }}
          </span>
          <i class="fa-solid fa-xmark text-base-content/60" />
          <span class="w-12 text-center" :class="{ 'font-bold': isGuessAwayTeamWinningPenalties }">
            {{ guess.awayTeamPenaltiesTimeGoals ?? '-' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Match Result -->
    <div class="divider my-3">
      <div class="flex gap-1 items-center">
        <span class="text-base-content/60">Resultado:</span>
        <span class="font-medium">{{ matchResultText }}</span>
      </div>
    </div>

    <div
      v-if="matchHasResult"
      class="rounded-box py-3 px-2 w-full bg-base-200 self-center flex flex-col gap-2"
    >
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
                :class="{
                  'font-bold': isMatchHomeTeamWinning,
                }"
              >
                {{ match.homeTeam?.name }}
                <span class="font-bold" v-if="isMatchHomeTeamWinningPenalties"> * </span>
              </span>
            </div>
            <div class="flex gap-1">
              <span
                class="w-12 text-center"
                :class="{ 'font-bold': isMatchHomeTeamWinningRegularTime }"
                disabled
                >{{ match.regularTimeHomeTeamGoals ?? '-' }}</span
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
                class="text-sm md:text-base text-left"
                :class="{
                  'font-bold': isMatchAwayTeamWinning,
                }"
              >
                {{ match.awayTeam?.name }}
                <span class="font-bold" v-if="isMatchAwayTeamWinningPenalties"> * </span>
              </span>
            </div>
            <div class="flex gap-1">
              <span
                class="w-12 text-center"
                :class="{ 'font-bold': isMatchAwayTeamWinningRegularTime }"
                disabled
              >
                {{ match.regularTimeAwayTeamGoals ?? '-' }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Penalties -->
      <div v-if="hasMatchPenalties" class="flex flex-col">
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
            <span class="w-8 text-center" :class="{ 'font-bold': isMatchHomeTeamWinningPenalties }">
              {{ match.penaltiesTimeHomeTeamGoals ?? '-' }}
            </span>
            <i class="fa-solid fa-xmark text-base-content/60 text-xs" />
            <span class="w-8 text-center" :class="{ 'font-bold': isMatchAwayTeamWinningPenalties }">
              {{ match.penaltiesTimeAwayTeamGoals ?? '-' }}
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
</template>
