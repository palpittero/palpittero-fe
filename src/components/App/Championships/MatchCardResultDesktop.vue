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
  <div class="hidden lg:flex flex-col gap-2 items-center">
    <!-- Teams and scores -->
    <div class="flex flex-col gap-1">
      <div class="text-center text-xs font-medium">Tempo Regular</div>
      <div class="grid grid-cols-12 gap-2">
        <!-- Home team -->
        <div class="col-span-5 flex flex-row items-center justify-end gap-2">
          <span
            class="text-sm md:text-base text-right"
            :class="{
              'font-bold': isGuessHomeTeamWinning,
            }"
          >
            {{ match.homeTeam?.name }}
            <span class="font-bold" v-if="isGuessHomeTeamWinningPenalties"> * </span>
          </span>
          <BaseImage
            :src="match.homeTeam?.badge"
            :alt="match.homeTeam?.name"
            class="size-10 rounded-lg border border-base-300"
          />
        </div>
        <!-- Score -->
        <div class="col-span-2 flex items-center justify-around gap-2">
          <span
            class="w-14 text-center"
            :class="{ 'font-bold': isGuessHomeTeamWinningRegularTime }"
            disabled
            >{{ guess.homeTeamRegularTimeGoals ?? '-' }}</span
          >
          <i class="fa-solid fa-xmark text-base-content/60" />
          <span
            class="w-14 text-center"
            :class="{ 'font-bold': isGuessAwayTeamWinningRegularTime }"
            disabled
          >
            {{ guess.awayTeamRegularTimeGoals ?? '-' }}</span
          >
        </div>

        <!-- Away team -->
        <div class="col-span-5 flex flex-row items-center justify-start gap-2">
          <BaseImage
            :src="match.awayTeam?.badge"
            :alt="match.awayTeam?.name"
            class="size-10 rounded-lg border border-base-300"
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
      </div>
    </div>

    <div v-if="hasPenaltiesGuess" class="flex items-center flex-col w-56 rounded-lg">
      <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
      <div class="grid grid-cols-12 gap-2">
        <div class="col-span-5 flex flex-row items-center justify-end gap-2">
          <span class="w-8 text-center" :class="{ 'font-bold': isGuessHomeTeamWinningPenalties }">
            {{ guess.homeTeamPenaltiesTimeGoals ?? '-' }}
          </span>
        </div>
        <div class="col-span-2 flex items-center justify-around gap-2">
          <i class="fa-solid fa-xmark text-base-content/60" />
        </div>
        <div class="col-span-5 flex flex-row items-center justify-start gap-2">
          <span class="w-8 text-center" :class="{ 'font-bold': isGuessAwayTeamWinningPenalties }">
            {{ guess.awayTeamPenaltiesTimeGoals ?? '-' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Match Result -->
    <div class="divider my-3">
      <div class="flex gap-1 items-center">
        <span class="text-base-content/60">Resultado:</span>
        <span class="font-bold">{{ matchResultText }}</span>
      </div>
    </div>

    <div
      v-if="matchHasResult"
      class="rounded-box py-3 px-2 bg-base-200 w-[80%] self-center flex flex-col gap-2"
    >
      <div class="flex flex-col gap-1">
        <div class="text-center text-xs font-medium">Tempo Regular</div>
        <div class="grid grid-cols-12 gap-2">
          <!-- Home team -->
          <div class="col-span-5 flex flex-row items-center justify-end gap-2">
            <span
              class="text-sm md:text-base text-right"
              :class="{
                'font-bold': isMatchHomeTeamWinning,
              }"
            >
              {{ match.homeTeam?.name }}
              <span class="font-bold" v-if="isMatchHomeTeamWinningPenalties"> * </span>
            </span>
            <BaseImage
              :src="match.homeTeam?.badge"
              :alt="match.homeTeam?.name"
              class="size-6 rounded-md border border-base-300"
            />
          </div>
          <!-- Score -->
          <div class="col-span-2 flex items-center justify-around gap-1">
            <span
              class="w-14 text-center"
              :class="{ 'font-bold': isMatchHomeTeamWinningRegularTime }"
            >
              {{ match.regularTimeHomeTeamGoals ?? '-' }}</span
            >
            <i class="fa-solid fa-xmark text-base-content/60 text-xs" />
            <span
              class="w-14 text-center"
              :class="{ 'font-bold': isMatchAwayTeamWinningRegularTime }"
            >
              {{ match.regularTimeAwayTeamGoals ?? '-' }}</span
            >
          </div>

          <!-- Away team -->
          <div class="col-span-5 flex flex-row items-center justify-start gap-2">
            <BaseImage
              :src="match.awayTeam?.badge"
              :alt="match.awayTeam?.name"
              class="size-6 rounded-md border border-base-300"
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
        </div>
      </div>

      <div v-if="hasMatchPenalties" class="flex flex-col">
        <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
        <div class="grid grid-cols-12 justify-center gap-2 items-center">
          <div
            class="border-base-300 col-span-2 flex items-center justify-around gap-1 col-start-6"
          >
            <span
              class="w-14 text-center"
              :class="{ 'font-bold': isMatchHomeTeamWinningPenalties }"
            >
              {{ match.penaltiesTimeHomeTeamGoals ?? '-' }}
            </span>
            <i class="fa-solid fa-xmark text-base-content/60 text-xs" />
            <span
              class="w-14 text-center"
              :class="{ 'font-bold': isMatchAwayTeamWinningPenalties }"
            >
              {{ match.penaltiesTimeAwayTeamGoals ?? '-' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
