<script setup lang="ts">
import { computed } from 'vue'
import type { iMatch, iMatchGuess } from '@/types'
import MatchStatus from '@/components/Admin/Matches/MatchStatus.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'
import MatchGuessPointsBadge from './MatchGuessPointsBadge.vue'
import MatchCardResultDesktop from './MatchCardResultDesktop.vue'
import MatchCardResultMobile from './MatchCardResultMobile.vue'

const props = defineProps<{
  match: iMatch
  guess: iMatchGuess
  memoryRegisteredGuesses?: number[]
}>()

// Guess
const guessHomeTeamRegularTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamRegularTimeGoals)),
)

const guessAwayTeamRegularTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamRegularTimeGoals)),
)

const guessHomeTeamPenaltiesTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamPenaltiesTimeGoals)),
)

const guessAwayTeamPenaltiesTimeGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamPenaltiesTimeGoals)),
)

const isGuessHomeTeamWinningRegularTime = computed<boolean>(
  () => guessHomeTeamRegularTimeGoals.value > guessAwayTeamRegularTimeGoals.value,
)

const isGuessAwayTeamWinningRegularTime = computed<boolean>(
  () => guessAwayTeamRegularTimeGoals.value > guessHomeTeamRegularTimeGoals.value,
)

const isGuessHomeTeamWinningPenalties = computed<boolean>(
  () => guessHomeTeamPenaltiesTimeGoals.value > guessAwayTeamPenaltiesTimeGoals.value,
)

const isGuessAwayTeamWinningPenalties = computed<boolean>(
  () => guessAwayTeamPenaltiesTimeGoals.value > guessHomeTeamPenaltiesTimeGoals.value,
)

const isGuessHomeTeamWinning = computed<boolean>(
  () => isGuessHomeTeamWinningRegularTime.value || isGuessHomeTeamWinningPenalties.value,
)

const isGuessAwayTeamWinning = computed<boolean>(
  () => isGuessAwayTeamWinningRegularTime.value || isGuessAwayTeamWinningPenalties.value,
)

const hasPenaltiesGuess = computed<boolean>(
  () =>
    !isNaN(guessHomeTeamPenaltiesTimeGoals.value) && !isNaN(guessAwayTeamPenaltiesTimeGoals.value),
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

const isMatchHomeTeamWinning = computed<boolean>(
  () => isMatchHomeTeamWinningRegularTime.value || isMatchHomeTeamWinningPenalties.value,
)

const isMatchAwayTeamWinning = computed<boolean>(
  () => isMatchAwayTeamWinningRegularTime.value || isMatchAwayTeamWinningPenalties.value,
)

const isMatchAwayTeamWinningPenalties = computed<boolean>(
  () => matchPenaltiesAwayTeamGoals.value > matchPenaltiesHomeTeamGoals.value,
)

const matchHasResult = computed<boolean>(
  () => !isNaN(matchRegularTimeHomeTeamGoals.value) && !isNaN(matchRegularTimeAwayTeamGoals.value),
)

const hasMatchPenalties = computed<boolean>(
  () => !isNaN(matchPenaltiesHomeTeamGoals.value) && !isNaN(matchPenaltiesAwayTeamGoals.value),
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
    class="card bg-base-200/50 shadow-sm"
    :class="{ 'bg-warning/10 border border-warning/30': isUnregisteredGuess }"
  >
    <div class="card-body py-2 px-4">
      <div class="flex flex-col gap-2 items-center">
        <div class="flex w-full lg:absolute lg:px-4 lg:justify-between justify-center">
          <div>
            <span
              v-if="match?.group"
              class="hidden lg:block badge badge-xs badge-outline border-base-300"
            >
              {{ match?.group?.name }}
            </span>
          </div>
          <MatchGuessPointsBadge :guess="guess" />
        </div>
        <div class="flex flex-col items-center justify-end gap-1">
          <MatchStatus :status="match.status!" />
          <FormattedDate :date="match.date!" class="text-xs text-base-content/60" />
        </div>
      </div>

      <MatchCardResultDesktop
        :match="match"
        :guess="guess"
        :is-guess-home-team-winning-regular-time="isGuessHomeTeamWinningRegularTime"
        :is-guess-away-team-winning-regular-time="isGuessAwayTeamWinningRegularTime"
        :is-guess-home-team-winning-penalties="isGuessHomeTeamWinningPenalties"
        :is-guess-away-team-winning-penalties="isGuessAwayTeamWinningPenalties"
        :is-guess-home-team-winning="isGuessHomeTeamWinning"
        :is-guess-away-team-winning="isGuessAwayTeamWinning"
        :has-penalties-guess="hasPenaltiesGuess"
        :match-has-result="matchHasResult"
        :has-match-penalties="hasMatchPenalties"
        :match-result-text="matchResultText"
        :is-match-home-team-winning-regular-time="isMatchHomeTeamWinningRegularTime"
        :is-match-away-team-winning-regular-time="isMatchAwayTeamWinningRegularTime"
        :is-match-home-team-winning-penalties="isMatchHomeTeamWinningPenalties"
        :is-match-away-team-winning-penalties="isMatchAwayTeamWinningPenalties"
        :is-match-home-team-winning="isMatchHomeTeamWinning"
        :is-match-away-team-winning="isMatchAwayTeamWinning"
      />

      <MatchCardResultMobile
        :match="match"
        :guess="guess"
        :is-guess-home-team-winning-regular-time="isGuessHomeTeamWinningRegularTime"
        :is-guess-away-team-winning-regular-time="isGuessAwayTeamWinningRegularTime"
        :is-guess-home-team-winning-penalties="isGuessHomeTeamWinningPenalties"
        :is-guess-away-team-winning-penalties="isGuessAwayTeamWinningPenalties"
        :is-guess-home-team-winning="isGuessHomeTeamWinning"
        :is-guess-away-team-winning="isGuessAwayTeamWinning"
        :has-penalties-guess="hasPenaltiesGuess"
        :match-has-result="matchHasResult"
        :has-match-penalties="hasMatchPenalties"
        :match-result-text="matchResultText"
        :is-match-home-team-winning-regular-time="isMatchHomeTeamWinningRegularTime"
        :is-match-away-team-winning-regular-time="isMatchAwayTeamWinningRegularTime"
        :is-match-home-team-winning-penalties="isMatchHomeTeamWinningPenalties"
        :is-match-away-team-winning-penalties="isMatchAwayTeamWinningPenalties"
        :is-match-home-team-winning="isMatchHomeTeamWinning"
        :is-match-away-team-winning="isMatchAwayTeamWinning"
      />

      <!-- View other guesses button -->
      <div class="flex justify-center lg:justify-end">
        <button class="link link-hover text-xs gap-2" @click="$emit('view-guesses', match)">
          <i class="fa-solid fa-search" />
          Ver palpites
        </button>
      </div>
    </div>
  </div>
</template>
