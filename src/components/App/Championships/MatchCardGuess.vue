<script setup lang="ts">
import { computed } from 'vue'
import type { iMatch, iMatchGuess } from '@/types'
import MatchStatus from '@/components/Admin/Matches/MatchStatus.vue'

import FormattedDate from '@/components/Shared/FormattedDate.vue'
import MatchCardGuessDesktop from './MatchCardGuessDesktop.vue'
import MatchCardGuessMobile from './MatchCardGuessMobile.vue'
import services from '@/services'
import { useToastStore } from '@/stores'

const props = defineProps<{
  match: iMatch
  leagueId: number
  memoryRegisteredGuesses?: number[]
}>()

const emit = defineEmits<{
  'view-guesses': [match: iMatch]
}>()

const guess = defineModel<iMatchGuess>({ required: true })

const homeTeamRegularTimeGoals = computed<number>(() =>
  parseInt(String(guess.value.homeTeamRegularTimeGoals)),
)

const awayTeamRegularTimeGoals = computed<number>(() =>
  parseInt(String(guess.value.awayTeamRegularTimeGoals)),
)

const homeTeamPenaltiesTimeGoals = computed<number>(() =>
  parseInt(String(guess.value.homeTeamPenaltiesTimeGoals)),
)

const awayTeamPenaltiesTimeGoals = computed<number>(() =>
  parseInt(String(guess.value.awayTeamPenaltiesTimeGoals)),
)

const isRegularTimeDraw = computed<boolean>(
  () => homeTeamRegularTimeGoals.value === awayTeamRegularTimeGoals.value,
)

const isRegularTimeEmpty = computed<boolean>(
  () => isNaN(homeTeamRegularTimeGoals.value) && isNaN(awayTeamRegularTimeGoals.value),
)

const isPenaltiesTimeDraw = computed<boolean>(
  () => homeTeamPenaltiesTimeGoals.value === awayTeamPenaltiesTimeGoals.value,
)

const isPenaltiesRound = computed<boolean>(() =>
  ['extraTime', 'penalties'].includes(props.match.round?.type ?? ''),
)

const hasPenaltiesGuess = computed<boolean>(
  () => !isNaN(homeTeamPenaltiesTimeGoals.value) && !isNaN(awayTeamPenaltiesTimeGoals.value),
)

const allowPenaltiesGuess = computed<boolean>(
  () => isPenaltiesRound.value && (isRegularTimeDraw.value || hasPenaltiesGuess.value),
)

const isHomeTeamWinningRegularTime = computed<boolean>(
  () => homeTeamRegularTimeGoals.value > awayTeamRegularTimeGoals.value,
)

const isAwayTeamWinningRegularTime = computed<boolean>(
  () => awayTeamRegularTimeGoals.value > homeTeamRegularTimeGoals.value,
)

const isHomeTeamWinningPenalties = computed<boolean>(
  () => homeTeamPenaltiesTimeGoals.value > awayTeamPenaltiesTimeGoals.value,
)

const isAwayTeamWinningPenalties = computed<boolean>(
  () => awayTeamPenaltiesTimeGoals.value > homeTeamPenaltiesTimeGoals.value,
)

const isHomeTeamWinning = computed<boolean>(
  () => isHomeTeamWinningRegularTime.value || isHomeTeamWinningPenalties.value,
)

const isAwayTeamWinning = computed<boolean>(
  () => isAwayTeamWinningRegularTime.value || isAwayTeamWinningPenalties.value,
)

const isMatchGuessValid = computed<boolean>(() => {
  if (isRegularTimeDraw.value) {
    const isPenaltiesGuessValid =
      !isNaN(homeTeamPenaltiesTimeGoals.value) &&
      !isNaN(awayTeamPenaltiesTimeGoals.value) &&
      !isPenaltiesTimeDraw.value

    return isPenaltiesGuessValid
  } else {
    const isRegularTimeGuessEmpty =
      isNaN(homeTeamRegularTimeGoals.value) && isNaN(awayTeamRegularTimeGoals.value)

    const isRegularTimeGuessValid =
      !isNaN(homeTeamRegularTimeGoals.value) && !isNaN(awayTeamRegularTimeGoals.value)

    return isRegularTimeGuessValid || isRegularTimeGuessEmpty
  }
})

const invalidGuessMessage = computed<string>(() => {
  if (isPenaltiesTimeDraw.value) {
    return 'Disputa de pênaltis não pode terminar empatada'
  } else if (isRegularTimeDraw.value && !hasPenaltiesGuess.value) {
    return 'Informe o placar da disputa de pênaltis'
  }

  return 'Informe o placar do tempo regular'
})

const toastStore = useToastStore()

const registerGuesses = async () => {
  try {
    guess.value.leagueId = props.leagueId

    const payload = {
      matchesGuesses: [guess.value],
      championshipsGuesses: [],
    }

    await services.guesses.registerGuesses(payload)

    toastStore.success('Palpite registrado com sucesso!')
  } catch (error) {
    console.error('Error registering guesses:', error)
    toastStore.error('Erro ao registrar palpites')
  }
}

const handleUpdateGuess = () => {
  if (isRegularTimeEmpty.value) {
    guess.value.homeTeamRegularTimeGoals = null
    guess.value.awayTeamRegularTimeGoals = null
  }

  if (!isRegularTimeDraw.value) {
    guess.value.homeTeamPenaltiesTimeGoals = null
    guess.value.awayTeamPenaltiesTimeGoals = null
  }

  if (isMatchGuessValid.value) {
    registerGuesses()
  }
}
</script>

<template>
  <div
    class="card bg-base-200/50 shadow-sm"
    :class="{ ' border border-error': !isMatchGuessValid }"
  >
    <div class="card-body py-2 px-4">
      <div class="flex flex-col gap-2 items-center">
        <div class="text-center">
          <div class="badge badge-xs badge-outline border-base-300" v-if="match?.group">
            {{ match?.group?.name }}
          </div>
        </div>
        <div class="flex flex-col items-center justify-end gap-2">
          <MatchStatus :status="match.status!" />
          <FormattedDate :date="match.date!" class="text-xs text-base-content/60" />
        </div>
      </div>

      <MatchCardGuessDesktop
        v-model="guess"
        :match="match"
        :is-home-team-winning="isHomeTeamWinning"
        :is-away-team-winning="isAwayTeamWinning"
        :is-home-team-winning-regular-time="isHomeTeamWinningRegularTime"
        :is-away-team-winning-regular-time="isAwayTeamWinningRegularTime"
        :is-home-team-winning-penalties="isHomeTeamWinningPenalties"
        :is-away-team-winning-penalties="isAwayTeamWinningPenalties"
        :allow-penalties-guess="allowPenaltiesGuess"
        @update-guess="handleUpdateGuess"
      />

      <MatchCardGuessMobile
        v-model="guess"
        :match="match"
        :is-home-team-winning="isHomeTeamWinning"
        :is-away-team-winning="isAwayTeamWinning"
        :is-home-team-winning-regular-time="isHomeTeamWinningRegularTime"
        :is-away-team-winning-regular-time="isAwayTeamWinningRegularTime"
        :is-home-team-winning-penalties="isHomeTeamWinningPenalties"
        :is-away-team-winning-penalties="isAwayTeamWinningPenalties"
        :allow-penalties-guess="allowPenaltiesGuess"
        @update-guess="handleUpdateGuess"
      />

      <!-- View other guesses button -->
      <div class="flex justify-center lg:justify-end">
        <button class="link link-hover text-xs link-xs" @click="emit('view-guesses', match)">
          <i class="fa-solid fa-search" />
          Ver palpites
        </button>
      </div>

      <div v-if="!isMatchGuessValid" class="flex justify-center">
        <div class="badge badge-error badge-sm badge-soft border">
          <i class="fa-solid fa-warning" />
          {{ invalidGuessMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
