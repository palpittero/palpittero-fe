<script setup lang="ts">
import { computed } from 'vue'
import type { iMatch, iMatchGuess } from '@/types'
import MatchStatus from '@/components/Admin/Matches/MatchStatus.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'
import MatchGuessPointsBadge from './MatchGuessPointsBadge.vue'

const props = defineProps<{
  match: iMatch
  guess: iMatchGuess
  memoryRegisteredGuesses?: number[]
}>()

// Guess
const guessRegularTimeHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamRegularTimeGoals)),
)
const guessRegularTimeAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamRegularTimeGoals)),
)

const guessPenaltiesHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamPenaltiesTimeGoals)),
)

const guessPenaltiesAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamPenaltiesTimeGoals)),
)

const isGuessHomeTeamWinningRegularTime = computed<boolean>(
  () => guessRegularTimeHomeTeamGoals.value > guessRegularTimeAwayTeamGoals.value,
)

const isGuessAwayTeamWinningRegularTime = computed<boolean>(
  () => guessRegularTimeAwayTeamGoals.value > guessRegularTimeHomeTeamGoals.value,
)

const isGuessHomeTeamWinningPenalties = computed<boolean>(
  () => guessPenaltiesHomeTeamGoals.value > guessPenaltiesAwayTeamGoals.value,
)

const isGuessAwayTeamWinningPenalties = computed<boolean>(
  () => guessPenaltiesAwayTeamGoals.value > guessPenaltiesHomeTeamGoals.value,
)

const hasPenaltiesGuess = computed<boolean>(
  () =>
    props.guess.homeTeamPenaltiesTimeGoals !== null ||
    props.guess.awayTeamPenaltiesTimeGoals !== null,
)

const isUnregisteredGuess = computed<boolean>(
  () => !props.guess.id && !props.memoryRegisteredGuesses?.includes(props.match.id as number),
)

// Match

const matchRegularTimeHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.match.regularTimeHomeTeamGoals)),
)
const matchRegularTimeAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.match.regularTimeAwayTeamGoals)),
)

const matchPenaltiesHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.match.penaltiesTimeHomeTeamGoals)),
)
const matchPenaltiesAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.match.penaltiesTimeAwayTeamGoals)),
)

const isMatchHomeTeamWinningRegularTime = computed<boolean>(
  () => matchRegularTimeHomeTeamGoals.value > matchRegularTimeAwayTeamGoals.value,
)

const isMatchAwayTeamWinningRegularTime = computed<boolean>(
  () => matchRegularTimeAwayTeamGoals.value > matchRegularTimeHomeTeamGoals.value,
)

const isMatchHomeTeamWinningPenalties = computed<boolean>(
  () => matchPenaltiesHomeTeamGoals.value > matchPenaltiesAwayTeamGoals.value,
)

const isMatchAwayTeamWinningPenalties = computed<boolean>(
  () => matchPenaltiesAwayTeamGoals.value > matchPenaltiesHomeTeamGoals.value,
)

const matchHasResult = computed<boolean>(
  () => !isNaN(matchRegularTimeHomeTeamGoals.value) && !isNaN(matchRegularTimeAwayTeamGoals.value),
)

const hasMatchPenalties = computed<boolean>(
  () =>
    props.match.penaltiesTimeHomeTeamGoals !== null &&
    props.match.penaltiesTimeAwayTeamGoals !== null,
)

const matchResultText = computed<string>(() => {
  if (!matchHasResult.value) return 'Placar não registrado'

  if (matchRegularTimeHomeTeamGoals.value === matchRegularTimeAwayTeamGoals.value) {
    if (hasMatchPenalties.value) {
      return matchPenaltiesHomeTeamGoals.value > matchPenaltiesAwayTeamGoals.value
        ? 'Casa nos pênaltis'
        : 'Visitante nos pênaltis'
    }

    return 'Empate'
  }

  return matchRegularTimeHomeTeamGoals.value > matchRegularTimeAwayTeamGoals.value
    ? 'Vitória do time da casa'
    : 'Vitória do time visitante'
})
</script>

<template>
  <div
    class="card bg-base-200/50 shadow-sm mb-4"
    :class="{ 'bg-warning/10 border border-warning/30': isUnregisteredGuess }"
  >
    <div class="card-body p-4">
      <div
        class="flex flex-col lg:flex-row items-center mb-4 gap-2"
        :class="{ 'justify-between': match?.group, 'justify-center': !match?.group }"
      >
        <div class="text-center" v-if="match?.group">
          <div class="badge badge-sm badge-outline border-base-300">
            {{ match?.group?.name }}
          </div>
        </div>
        <MatchGuessPointsBadge :guess="guess" class="lg:absolute top-3 right-3" />
        <div class="flex items-center justify-center lg:justify-between gap-2">
          <FormattedDate :date="match.date!" class="text-xs text-base-content/60" />
          <MatchStatus :status="match.status!" />
        </div>
      </div>

      <!-- Teams and scores -->
      <div class="flex flex-col gap-2">
        <div class="text-center text-xs font-medium">Tempo Regular</div>
        <div class="flex lg:grid lg:grid-cols-12 justify-center gap-2 items-center">
          <!-- Home team -->
          <div class="col-span-5 flex flex-col-reverse lg:flex-row items-center justify-end gap-2">
            <span
              class="text-sm md:text-base text-right"
              :class="{
                'font-bold': isGuessHomeTeamWinningRegularTime || isGuessHomeTeamWinningPenalties,
              }"
            >
              {{ match.homeTeam?.name }}
              <span class="font-bold" v-if="isGuessHomeTeamWinningPenalties"> * </span>
            </span>
            <BaseImage
              :src="match.homeTeam?.badge"
              :alt="match.homeTeam?.name"
              class="size-6 lg:size-10 rounded-lg border border-base-300"
            />
          </div>
          <!-- Score -->
          <div class="col-span-2 flex items-center justify-around gap-2">
            <span
              class="w-12 lg:w-14 text-center"
              :class="{ 'font-bold': isGuessHomeTeamWinningRegularTime }"
              disabled
              >{{ guess.homeTeamRegularTimeGoals ?? '-' }}</span
            >
            <i class="fa-solid fa-xmark text-base-content/60" />
            <span
              class="w-12 lg:w-14 text-center"
              :class="{ 'font-bold': isGuessAwayTeamWinningRegularTime }"
              disabled
            >
              {{ guess.awayTeamRegularTimeGoals ?? '-' }}</span
            >
          </div>

          <!-- Away team -->
          <div class="col-span-5 flex flex-col lg:flex-row items-center justify-start gap-2">
            <BaseImage
              :src="match.awayTeam?.badge"
              :alt="match.awayTeam?.name"
              class="size-6 lg:size-10 rounded-lg border border-base-300"
            />
            <span
              class="text-sm md:text-base text-left"
              :class="{
                'font-bold': isGuessAwayTeamWinningRegularTime || isGuessAwayTeamWinningPenalties,
              }"
            >
              {{ match.awayTeam?.name }}
              <span class="font-bold" v-if="isGuessAwayTeamWinningPenalties"> * </span>
            </span>
          </div>
        </div>
      </div>

      <div v-if="hasPenaltiesGuess" class="flex flex-col gap-2">
        <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
        <div class="flex lg:grid lg:grid-cols-12 justify-center gap-2 items-center">
          <div class="col-span-2 flex items-center justify-around gap-2 col-start-6">
            <span
              class="w-12 lg:w-14 text-center"
              :class="{ 'font-bold': isGuessHomeTeamWinningPenalties }"
            >
              {{ guess.homeTeamPenaltiesTimeGoals ?? '-' }}
            </span>
            <i class="fa-solid fa-xmark text-base-content/60" />
            <span
              class="w-12 lg:w-14 text-center"
              :class="{ 'font-bold': isGuessAwayTeamWinningPenalties }"
            >
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
        class="rounded-box py-3 px-2 bg-base-200 w-[80%] self-center flex flex-col gap-2"
      >
        <div class="flex flex-col gap-2">
          <div class="text-center text-xs font-medium">Tempo Regular</div>
          <div class="flex lg:grid lg:grid-cols-12 justify-center gap-2 items-center">
            <!-- Home team -->
            <div
              class="col-span-5 flex flex-col-reverse lg:flex-row items-center justify-end gap-2"
            >
              <span
                class="text-sm md:text-base text-right"
                :class="{
                  'font-bold': isMatchHomeTeamWinningRegularTime || isMatchHomeTeamWinningPenalties,
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
                class="w-12 lg:w-14 text-center"
                :class="{ 'font-bold': isMatchHomeTeamWinningRegularTime }"
              >
                {{ match.regularTimeHomeTeamGoals ?? '-' }}</span
              >
              <i class="fa-solid fa-xmark text-base-content/60 text-xs" />
              <span
                class="w-12 lg:w-14 text-center"
                :class="{ 'font-bold': isMatchAwayTeamWinningRegularTime }"
              >
                {{ match.regularTimeAwayTeamGoals ?? '-' }}</span
              >
            </div>

            <!-- Away team -->
            <div class="col-span-5 flex flex-col lg:flex-row items-center justify-start gap-2">
              <BaseImage
                :src="match.awayTeam?.badge"
                :alt="match.awayTeam?.name"
                class="size-6 rounded-md border border-base-300"
              />
              <span
                class="text-sm md:text-base text-left"
                :class="{
                  'font-bold': isMatchAwayTeamWinningRegularTime || isMatchAwayTeamWinningPenalties,
                }"
              >
                {{ match.awayTeam?.name }}
                <span class="font-bold" v-if="isMatchAwayTeamWinningPenalties"> * </span>
              </span>
            </div>
          </div>
        </div>

        <div v-if="hasMatchPenalties" class="flex flex-col gap-2">
          <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
          <div class="flex lg:grid lg:grid-cols-12 justify-center gap-2 items-center">
            <div
              class="border-base-300 col-span-2 flex items-center justify-around gap-1 col-start-6"
            >
              <span
                class="w-12 lg:w-14 text-center"
                :class="{ 'font-bold': isMatchHomeTeamWinningPenalties }"
              >
                {{ match.penaltiesTimeHomeTeamGoals ?? '-' }}
              </span>
              <i class="fa-solid fa-xmark text-base-content/60 text-xs" />
              <span
                class="w-12 lg:w-14 text-center"
                :class="{ 'font-bold': isMatchAwayTeamWinningPenalties }"
              >
                {{ match.penaltiesTimeAwayTeamGoals ?? '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- View other guesses button -->
      <div class="flex justify-center mt-3">
        <button class="link link-hover text-xs gap-2" @click="$emit('view-guesses', match)">
          <i class="fa-solid fa-search" />
          Ver todos os palpites
        </button>
      </div>
    </div>
  </div>
</template>
