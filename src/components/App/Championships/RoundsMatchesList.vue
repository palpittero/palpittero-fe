<template>
  <div class="rounds-matches-list">
    <!-- Round selector -->
    <div class="flex items-center justify-between py-4 bg-base-200/50 px-4 rounded-lg mb-4">
      <button
        class="btn btn-ghost btn-sm"
        :disabled="isCurrentFirstRound"
        @click="handlePreviousRound"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div class="text-center">
        <div class="font-bold text-lg">{{ selectedRound?.name || 'Carregando...' }}</div>
        <div class="text-sm text-base-content/60">
          {{ matches.length }} {{ matches.length === 1 ? 'jogo' : 'jogos' }}
        </div>
      </div>

      <button class="btn btn-ghost btn-sm" :disabled="isCurrentLastRound" @click="handleNextRound">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-32 bg-base-300 rounded-lg"></div>
      </div>
    </div>

    <!-- Matches list -->
    <div v-else-if="matches.data.length > 0" class="space-y-4">
      <MatchCard
        v-for="match in orderedMatches"
        :key="match.id"
        :match="match"
        :guess="getMatchGuess(match.id)"
        :memory-registered-guesses="memoryRegisteredGuesses"
        @update:guess="handleUpdateGuess"
        @view-other-guesses="handleViewOtherGuesses"
      />
    </div>

    <!-- No matches state -->
    <div v-else class="text-center py-12">
      <div class="text-base-content/50 mb-4">
        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p class="text-lg font-medium">Nenhum jogo encontrado</p>
      <p class="text-sm text-base-content/70">Esta rodada ainda não possui jogos cadastrados</p>
    </div>
  </div>

  <!-- Match Guesses Dialog -->
  <div v-if="isMatchGuessesDialogVisible" class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Palpites do Jogo</h3>

      <div v-if="selectedMatch" class="text-center mb-6">
        <div class="flex items-center justify-center gap-4">
          <div class="flex items-center gap-2">
            <BaseImage
              v-if="selectedMatch.homeTeam?.badge"
              :src="selectedMatch.homeTeam.badge"
              :alt="selectedMatch.homeTeam?.name"
              class="w-8 h-8 rounded-full"
            />
            <span class="font-medium">{{ selectedMatch.homeTeam?.name }}</span>
          </div>
          <span class="text-lg">×</span>
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ selectedMatch.awayTeam?.name }}</span>
            <BaseImage
              v-if="selectedMatch.awayTeam?.badge"
              :src="selectedMatch.awayTeam.badge"
              :alt="selectedMatch.awayTeam?.name"
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>

      <p class="text-center py-8 text-base-content/60">
        Componente de visualização de palpites de outros usuários será implementado aqui.
      </p>

      <div class="modal-action">
        <button class="btn" @click="handleMatchGuessesDialogHide">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import services from '@/services'
import type { iMatch, iChampionshipRound, iState } from '@/types'
import MatchCard from './MatchCard.vue'
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
  modelValue: Record<number, MatchGuess>
  rounds: iChampionshipRound[]
  leagueId: number
  memoryRegisteredGuesses?: number[]
}>()

const emits = defineEmits<{
  'update:modelValue': [value: Record<number, MatchGuess>]
}>()

const route = useRoute()
const router = useRouter()

const matches = reactive<iState<iMatch[]>>({
  loading: false,
  data: [],
  error: null,
})

const guesses = reactive<iState<MatchGuess[]>>({
  loading: false,
  data: [],
  error: null,
})

const isMatchGuessesDialogVisible = ref(false)
const selectedMatch = ref<iMatch | null>(null)

// Get current round from route or default to current round
const currentRound = computed(
  () =>
    props.rounds.find((round) => {
      if (props.rounds.length === 0) return false
      const championshipId = props.rounds[0]?.championship?.id
      if (!championshipId) return false

      return route.query[championshipId.toString()]
        ? round.id === parseInt(route.query[championshipId.toString()] as string)
        : round.current
    }) || props.rounds[0],
)

const selectedRoundIndex = ref(0)

// Update selected round index when current round changes
watch(
  currentRound,
  (newRound) => {
    if (newRound) {
      selectedRoundIndex.value = props.rounds.findIndex((round) => round.id === newRound.id)
    }
  },
  { immediate: true },
)

const selectedRound = computed(() => props.rounds[selectedRoundIndex.value])

const isCurrentFirstRound = computed(() => selectedRoundIndex.value === 0)
const isCurrentLastRound = computed(() => selectedRoundIndex.value === props.rounds.length - 1)

const isLoading = computed(() => matches.loading || guesses.loading)

// Order matches by status (scheduled first) then by date
const orderedMatches = computed(() => {
  return [...matches.data].sort((a, b) => {
    if (a.status === 'scheduled' && b.status !== 'scheduled') return -1
    if (a.status !== 'scheduled' && b.status === 'scheduled') return 1

    const dateA = new Date(a.date || '').getTime()
    const dateB = new Date(b.date || '').getTime()
    return dateA - dateB
  })
})

const loadMatchesAndGuesses = async (roundId: number) => {
  if (!roundId) return

  try {
    // Load matches and guesses in parallel
    matches.loading = true
    guesses.loading = true

    const [matchesData, guessesData] = await Promise.all([
      services.matches.fetchMatches({ roundId }),
      services.guesses.fetchMyGuesses({ roundId, leagueId: props.leagueId }),
    ])

    matches.data = matchesData
    guesses.data = guessesData

    // Update route query parameter
    const championshipId = selectedRound.value?.championship?.id
    if (championshipId) {
      const action = Object.keys(route.query).length === 0 ? 'replace' : 'push'
      router[action]({
        ...route,
        query: {
          ...route.query,
          [championshipId.toString()]: roundId.toString(),
        },
      })
    }
  } catch (error) {
    console.error('Error loading matches and guesses:', error)
    matches.error = error instanceof Error ? error : new Error('Unknown error')
  } finally {
    matches.loading = false
    guesses.loading = false
  }
}

const getMatchGuess = (matchId?: number | null): MatchGuess => {
  if (!matchId) return createEmptyGuess(0)

  const existingGuess = guesses.data.find((g) => g.matchId === matchId)
  if (existingGuess) return existingGuess

  return createEmptyGuess(matchId)
}

const createEmptyGuess = (matchId: number): MatchGuess => ({
  matchId,
  homeTeamRegularTimeGoals: null,
  awayTeamRegularTimeGoals: null,
  homeTeamPenaltiesTimeGoals: null,
  awayTeamPenaltiesTimeGoals: null,
})

const handleUpdateGuess = (updatedGuess: MatchGuess) => {
  // Update local guesses data
  const existingIndex = guesses.data.findIndex((g) => g.matchId === updatedGuess.matchId)

  if (existingIndex >= 0) {
    guesses.data[existingIndex] = updatedGuess
  } else {
    guesses.data.push(updatedGuess)
  }

  // Create the modelValue format expected by parent
  const modelValue: Record<number, MatchGuess> = {}
  guesses.data.forEach((guess) => {
    const match = matches.data.find((m) => m.id === guess.matchId)
    if (match) {
      modelValue[guess.matchId] = {
        ...guess,
        match,
      } as any
    }
  })

  emits('update:modelValue', modelValue)
}

const handleViewOtherGuesses = (match: iMatch) => {
  selectedMatch.value = match
  isMatchGuessesDialogVisible.value = true
}

const handleMatchGuessesDialogHide = () => {
  isMatchGuessesDialogVisible.value = false
  selectedMatch.value = null
}

const handlePreviousRound = () => {
  if (!isCurrentFirstRound.value) {
    selectedRoundIndex.value--
  }
}

const handleNextRound = () => {
  if (!isCurrentLastRound.value) {
    selectedRoundIndex.value++
  }
}

// Watch for round changes
watch(
  selectedRound,
  async (newRound) => {
    if (newRound?.id) {
      await loadMatchesAndGuesses(newRound.id)
    }
  },
  { immediate: true },
)

// Initialize on mount
onMounted(() => {
  if (selectedRound.value?.id) {
    loadMatchesAndGuesses(selectedRound.value.id)
  }
})
</script>

<!-- <style scoped lang="scss">
.rounds-matches-list {
  @apply space-y-4;
}
</style> -->
