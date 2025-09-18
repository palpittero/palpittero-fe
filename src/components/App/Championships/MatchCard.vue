<script setup lang="ts">
import { computed, ref } from 'vue'
import type { iMatch, iMatchGuess } from '@/types'
import MatchStatus from '@/components/Admin/Matches/MatchStatus.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'

const props = defineProps<{
  match: iMatch
  guess: iMatchGuess
  disabled?: boolean
  memoryRegisteredGuesses?: number[]
}>()

const emits = defineEmits<{
  'update:guess': [guess: iMatchGuess]
  'view-other-guesses': [match: iMatch]
}>()

const showPenalties = ref(false)

const isMatchScheduled = computed(() => props.match.status === 'scheduled')

const isUnregisteredGuess = computed(() => {
  return !props.guess.id && !props.memoryRegisteredGuesses?.includes(props.match.id as number)
})

const allowPenaltiesGuess = computed(() => {
  if (!isMatchScheduled.value) return false

  const regularGoalsSet =
    props.guess.homeTeamRegularTimeGoals !== null && props.guess.awayTeamRegularTimeGoals !== null

  const isDraw =
    regularGoalsSet && props.guess.homeTeamRegularTimeGoals === props.guess.awayTeamRegularTimeGoals

  return isDraw && isPenaltiesRound.value
})

const hasPenalties = computed(() => {
  return (
    props.match.penaltiesTimeHomeTeamGoals !== null ||
    props.match.penaltiesTimeAwayTeamGoals !== null ||
    props.guess.homeTeamPenaltiesTimeGoals !== null ||
    props.guess.awayTeamPenaltiesTimeGoals !== null
  )
})

const hasMatchResult = computed<boolean>(
  () =>
    props.match.regularTimeHomeTeamGoals !== null && props.match.regularTimeAwayTeamGoals !== null,
)

const guessPoints = computed<number | null>(() => props.guess.points ?? null)

const isPenaltiesRound = computed<boolean>(() =>
  ['extraTime', 'penalties'].includes(props.match.round?.type || ''),
)

const isWinningTeam = (team: 'home' | 'away'): boolean => {
  const homeGoals = props.match.regularTimeHomeTeamGoals
  const awayGoals = props.match.regularTimeAwayTeamGoals

  if (homeGoals === null || awayGoals === null) return false

  if (team === 'home') {
    return Number(homeGoals) > Number(awayGoals)
  }
  return Number(awayGoals) > Number(homeGoals)
}

const getMatchResultText = () => {
  const homeGoals = props.match.regularTimeHomeTeamGoals
  const awayGoals = props.match.regularTimeAwayTeamGoals

  if (homeGoals === null || awayGoals === null) return 'N/A'

  if (homeGoals === awayGoals) {
    if (hasPenalties.value) {
      const homePen = props.match.penaltiesTimeHomeTeamGoals ?? 0
      const awayPen = props.match.penaltiesTimeAwayTeamGoals ?? 0

      return homePen > awayPen ? 'Casa nos pênaltis' : 'Visitante nos pênaltis'
    }
    return 'Empate'
  }

  return Number(homeGoals) > Number(awayGoals) ? 'Vitória da casa' : 'Vitória do visitante'
}

const updateGuess = () => {
  // Auto-clear penalties if regular time goals change and are no longer a draw
  if (
    props.guess.homeTeamRegularTimeGoals !== null &&
    props.guess.awayTeamRegularTimeGoals !== null &&
    props.guess.homeTeamRegularTimeGoals !== props.guess.awayTeamRegularTimeGoals
  ) {
    showPenalties.value = false
    props.guess.homeTeamPenaltiesTimeGoals = null
    props.guess.awayTeamPenaltiesTimeGoals = null
  }

  emits('update:guess', { ...props.guess })
}

// Initialize penalties display if guess has penalties
if (hasPenalties.value && isMatchScheduled.value) {
  showPenalties.value = true
}
</script>

<template>
  <div
    class="card bg-base-200/50 shadow-sm mb-4"
    :class="{ 'bg-warning/10 border border-warning/30': isUnregisteredGuess }"
  >
    <div class="card-body p-4">
      <div
        class="flex flex-col lg:flex-row items-center mb-4"
        :class="{ 'justify-between': match?.group, 'justify-center': !match?.group }"
      >
        <div class="text-center">
          <div class="badge badge-sm badge-outline border-base-300" v-if="match?.group">
            {{ match?.group?.name }}
          </div>
        </div>
        <div class="flex items-center justify-center lg:justify-between gap-2">
          <FormattedDate :date="match.date!" class="text-xs text-base-content/60" />
          <MatchStatus :status="match.status!" />
        </div>
      </div>

      <!-- Teams and scores -->
      <div class="flex lg:grid lg:grid-cols-12 justify-center gap-4 items-center mb-4">
        <!-- Home team -->
        <div class="col-span-5 flex flex-col-reverse lg:flex-row items-center justify-end gap-2">
          <span
            class="text-sm md:text-base text-right"
            :class="{ 'font-bold': isWinningTeam('home') }"
          >
            {{ match.homeTeam?.name }}
          </span>
          <BaseImage
            :src="match.homeTeam?.badge"
            :alt="match.homeTeam?.name"
            class="size-6 lg:size-10 rounded-lg border border-base-300"
          />
        </div>

        <div class="col-span-2 flex items-center justify-around gap-1">
          <template v-if="isMatchScheduled">
            <input
              v-model.number="guess.homeTeamRegularTimeGoals"
              type="text"
              min="0"
              max="20"
              class="input !w-12 !lg:w-14 text-center"
              :disabled="disabled"
              @input="updateGuess"
            />
            <i class="fa-solid fa-xmark text-base-content/60" />
            <input
              v-model.number="guess.awayTeamRegularTimeGoals"
              type="text"
              min="0"
              max="20"
              class="input !w-12 !lg:w-14 text-center"
              :disabled="disabled"
              @input="updateGuess"
            />
          </template>
          <div v-else class="flex items-center font-bold flex-1 justify-center">
            <input
              type="text"
              :value="match.regularTimeHomeTeamGoals ?? '-'"
              class="input !w-12 !lg:w-14 text-center !cursor-text !bg-transparent !text-black"
              :class="{ '!text-success': isWinningTeam('home') }"
              @input="updateGuess"
              disabled
            />
            <i class="fa-solid fa-xmark text-base-content/60" />
            <input
              type="text"
              :value="match.regularTimeAwayTeamGoals ?? '-'"
              class="input !w-12 !lg:w-14 text-center !cursor-text !bg-transparent !text-black"
              :class="{ '!text-success': isWinningTeam('away') }"
              disabled
              @input="updateGuess"
            />
          </div>
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
            :class="{ 'font-bold': isWinningTeam('away') }"
          >
            {{ match.awayTeam?.name }}
          </span>
        </div>
      </div>

      <!-- Penalties section (if applicable) -->
      <div v-if="allowPenaltiesGuess || hasPenalties" class="mb-4">
        <div v-if="isMatchScheduled && allowPenaltiesGuess" class="flex justify-center mb-2">
          <button class="btn btn-xs btn-ghost" @click="showPenalties = !showPenalties">
            {{ showPenalties ? 'Cancelar' : 'Palpitar pênaltis' }}
          </button>
        </div>

        <div v-if="showPenalties || hasPenalties" class="bg-base-200/50 p-3 rounded-box">
          <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
          <div class="grid grid-cols-12 gap-2 items-center">
            <div class="col-span-5"></div>
            <div class="col-span-2 flex items-center justify-center gap-1">
              <template v-if="isMatchScheduled">
                <input
                  v-model.number="guess.homeTeamPenaltiesTimeGoals"
                  type="number"
                  min="0"
                  max="10"
                  class="input input-xs w-12 text-center"
                  :disabled="disabled"
                  @input="updateGuess"
                />
                <span class="text-xs">×</span>
                <input
                  v-model.number="guess.awayTeamPenaltiesTimeGoals"
                  type="number"
                  min="0"
                  max="10"
                  class="input input-xs w-12 text-center"
                  :disabled="disabled"
                  @input="updateGuess"
                />
              </template>
              <template v-else>
                <div class="flex items-center gap-1 font-bold text-sm">
                  <span>{{ match.penaltiesTimeHomeTeamGoals ?? '-' }}</span>
                  <span class="text-xs">×</span>
                  <span>{{ match.penaltiesTimeAwayTeamGoals ?? '-' }}</span>
                </div>
              </template>
            </div>
            <div class="col-span-5"></div>
          </div>
        </div>
      </div>

      <!-- Match result and guess points -->
      <div v-if="!isMatchScheduled" class="flex justify-between items-center text-xs">
        <div v-if="hasMatchResult">
          <span class="text-base-content/60">Resultado:</span>
          <span class="font-medium ml-1">{{ getMatchResultText() }}</span>
        </div>
        <div v-if="guessPoints !== null" class="badge badge-success gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          {{ guessPoints }} pts
        </div>
      </div>

      <!-- View other guesses button -->
      <div class="flex justify-center mt-3">
        <button class="link link-hover gap-2" @click="$emit('view-other-guesses', match)">
          <i class="fa-solid fa-search" />
          Ver todos os palpites
        </button>
      </div>
    </div>
  </div>
</template>
