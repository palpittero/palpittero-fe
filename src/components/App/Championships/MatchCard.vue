<template>
  <div
    class="card bg-base-100 shadow-sm border border-base-300 mb-4"
    :class="{ 'bg-warning/10 border-warning/30': isUnregisteredGuess }"
  >
    <div class="card-body p-4">
      <!-- Match header with group and status -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-sm font-medium text-base-content/70">
          {{ match.group?.name || 'Grupo' }}
        </div>
        <div class="flex items-center gap-2">
          <div class="text-xs text-base-content/60">
            {{ formatDate(match.date) }}
          </div>
          <MatchStatus :status="match.status" />
        </div>
      </div>

      <!-- Teams and scores -->
      <div class="grid grid-cols-12 gap-2 items-center mb-4">
        <!-- Home team -->
        <div class="col-span-5 flex items-center justify-end gap-2">
          <span
            class="text-sm md:text-base text-right"
            :class="{ 'font-bold': isWinningTeam('home') }"
          >
            {{ match.homeTeam?.name }}
          </span>
          <BaseImage
            v-if="match.homeTeam?.badge"
            :src="match.homeTeam.badge"
            :alt="match.homeTeam.name"
            class="w-8 h-8 rounded-full bg-white border border-base-300"
          />
        </div>

        <!-- Score or inputs -->
        <div class="col-span-2 flex items-center justify-center gap-1">
          <template v-if="isMatchScheduled">
            <input
              v-model.number="guess.homeTeamRegularTimeGoals"
              type="number"
              min="0"
              max="20"
              class="input input-xs w-12 text-center"
              :disabled="disabled"
              @input="updateGuess"
            />
            <span class="text-xs">×</span>
            <input
              v-model.number="guess.awayTeamRegularTimeGoals"
              type="number"
              min="0"
              max="20"
              class="input input-xs w-12 text-center"
              :disabled="disabled"
              @input="updateGuess"
            />
          </template>
          <template v-else>
            <div class="flex items-center gap-1 font-bold">
              <span :class="{ 'text-success': isWinningTeam('home') }">
                {{ match.regularTimeHomeTeamGoals ?? '-' }}
              </span>
              <span class="text-xs">×</span>
              <span :class="{ 'text-success': isWinningTeam('away') }">
                {{ match.regularTimeAwayTeamGoals ?? '-' }}
              </span>
            </div>
          </template>
        </div>

        <!-- Away team -->
        <div class="col-span-5 flex items-center justify-start gap-2">
          <BaseImage
            v-if="match.awayTeam?.badge"
            :src="match.awayTeam.badge"
            :alt="match.awayTeam.name"
            class="w-8 h-8 rounded-full bg-white border border-base-300"
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
        <div
          v-if="isMatchScheduled && allowPenaltiesGuess"
          class="flex justify-center mb-2"
        >
          <button
            class="btn btn-xs btn-ghost"
            @click="showPenalties = !showPenalties"
          >
            {{ showPenalties ? 'Cancelar' : 'Palpitar pênaltis' }}
          </button>
        </div>

        <div
          v-if="showPenalties || hasPenalties"
          class="bg-base-200/50 p-3 rounded-lg"
        >
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
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {{ guessPoints }} pts
        </div>
      </div>

      <!-- View other guesses button -->
      <div class="flex justify-center mt-3">
        <button
          class="btn btn-ghost btn-xs gap-2"
          @click="$emit('view-other-guesses', match)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Ver outros palpites
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { iMatch } from '@/types'
import MatchStatus from '@/components/Admin/Matches/MatchStatus.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'

interface MatchGuess {
  id?: number
  matchId: number
  homeTeamRegularTimeGoals: number | null
  awayTeamRegularTimeGoals: number | null
  homeTeamPenaltiesTimeGoals: number | null
  awayTeamPenaltiesTimeGoals: number | null
  points?: number | null
}

const props = defineProps<{
  match: iMatch
  guess: MatchGuess
  disabled?: boolean
  memoryRegisteredGuesses?: number[]
}>()

const emits = defineEmits<{
  'update:guess': [guess: MatchGuess]
  'view-other-guesses': [match: iMatch]
}>()

const showPenalties = ref(false)

const isMatchScheduled = computed(() => props.match.status === 'scheduled')

const isUnregisteredGuess = computed(() => {
  return (
    !props.guess.id &&
    !props.memoryRegisteredGuesses?.includes(props.match.id as number)
  )
})

const allowPenaltiesGuess = computed(() => {
  if (!isMatchScheduled.value) return false

  const regularGoalsSet =
    props.guess.homeTeamRegularTimeGoals !== null &&
    props.guess.awayTeamRegularTimeGoals !== null

  const isDraw =
    regularGoalsSet &&
    props.guess.homeTeamRegularTimeGoals === props.guess.awayTeamRegularTimeGoals

  return isDraw && isPenaltiesRound()
})

const hasPenalties = computed(() => {
  return (
    props.match.penaltiesTimeHomeTeamGoals !== null ||
    props.match.penaltiesTimeAwayTeamGoals !== null ||
    props.guess.homeTeamPenaltiesTimeGoals !== null ||
    props.guess.awayTeamPenaltiesTimeGoals !== null
  )
})

const hasMatchResult = computed(() => {
  return (
    props.match.regularTimeHomeTeamGoals !== null &&
    props.match.regularTimeAwayTeamGoals !== null
  )
})

const guessPoints = computed(() => props.guess.points ?? null)

const isPenaltiesRound = () => {
  // This should check the round type from the match, but for now we'll assume it's possible
  return true
}

const isWinningTeam = (team: 'home' | 'away') => {
  const homeGoals = props.match.regularTimeHomeTeamGoals
  const awayGoals = props.match.regularTimeAwayTeamGoals

  if (homeGoals === null || awayGoals === null) return false

  if (team === 'home') return homeGoals > awayGoals
  return awayGoals > homeGoals
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return ''

  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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

  return homeGoals > awayGoals ? 'Vitória da casa' : 'Vitória do visitante'
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