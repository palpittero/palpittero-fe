<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import services from '@/services'
import type { iMatch, iChampionshipRound, iState, iMatchGuess } from '@/types'
import MatchCardGuess from './MatchCardGuess.vue'
import MatchCardResult from './MatchCardResult.vue'
import { orderMatchesByStatusAndDate } from '@/helpers/matches'
import BaseEmptyState from '@/components/Shared/BaseEmptyState.vue'
import ChampionshipRoundSelector from './ChampionshipRoundSelector.vue'
import RoundMatchesListSkeleton from '@/components/App/Championships/RoundMatchesListSkeleton.vue'

const props = defineProps<{
  // modelValue: Record<number, iMatchGuess>
  rounds: iChampionshipRound[]
  leagueId: number
  memoryRegisteredGuesses?: number[]
}>()

const emit = defineEmits<{
  // 'update:modelValue': [value: Record<number, iMatchGuess>]
  'view-guesses': [match: iMatch]
}>()

const matchesGuesses = defineModel<Record<number, iMatchGuess>>({ required: true })

const route = useRoute()
const router = useRouter()

// Matches
const matches = reactive<iState<iMatch[]>>({
  loading: false,
  data: [],
  error: null,
})

const hasNoMatches = computed<boolean>(() => matches.data.length === 0)

// Order matches by status (scheduled first) then by date
const orderedMatches = computed<iMatch[]>(() => orderMatchesByStatusAndDate(matches.data))

// Guesses
const guesses = reactive<iState<iMatchGuess[]>>({
  loading: false,
  data: [],
  error: null,
})

// Rounds
const selectedRound = computed<iChampionshipRound>(() => props.rounds[selectedRoundIndex.value])
const selectedRoundIndex = ref<number>(0)

const isCurrentFirstRound = computed(() => selectedRoundIndex.value === 0)
const isCurrentLastRound = computed(() => selectedRoundIndex.value === props.rounds.length - 1)

const currentRound = computed(() =>
  props.rounds.find((round) => {
    return route.query[round.championshipId]
      ? round.id === parseInt(route.query[round.championshipId] as string)
      : round.current
  }),
)

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

const updateRouteQuery = (roundId: number) => {
  const championshipId = selectedRound.value?.championshipId

  if (championshipId) {
    const action = Object.keys(route.query).length === 0 ? 'replace' : 'push'
    router[action]({
      ...route,
      query: {
        ...route.query,
        [championshipId]: roundId,
      },
    })
  }
}

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

    updateRouteQuery(roundId)
  } catch (error) {
    console.error('Error loading matches and guesses:', error)
    matches.error = error instanceof Error ? error : new Error('Unknown error')
  } finally {
    matches.loading = false
    guesses.loading = false
  }
}

watch(
  selectedRound,
  async (newRound) => {
    if (newRound?.id) {
      await loadMatchesAndGuesses(newRound.id)
    }
  },
  { immediate: true },
)

const isLoading = computed<boolean>(() => matches.loading || guesses.loading)

const matchesGuessesMap = computed<Record<number, iMatchGuess>>(() => {
  return matches.data.reduce(
    (acc, match) => {
      acc[match.id!] = getMatchGuess(match.id)
      return acc
    },
    {} as Record<number, iMatchGuess>,
  )
})

const getMatchGuess = (matchId?: number | null): iMatchGuess => {
  if (!matchId) return createEmptyGuess(0)

  const existingGuess = guesses.data.find((g) => g.matchId === matchId)
  if (existingGuess) return existingGuess

  return createEmptyGuess(matchId)
}

const createEmptyGuess = (matchId: number): iMatchGuess => ({
  matchId,
  homeTeamRegularTimeGoals: null,
  awayTeamRegularTimeGoals: null,
  homeTeamPenaltiesTimeGoals: null,
  awayTeamPenaltiesTimeGoals: null,
})

const handleUpdateGuess = (updatedGuess: iMatchGuess) => {
  // Update local guesses data
  const existingIndex = guesses.data.findIndex((g) => g.matchId === updatedGuess.matchId)

  if (updatedGuess.homeTeamRegularTimeGoals !== updatedGuess.awayTeamRegularTimeGoals) {
    updatedGuess.homeTeamPenaltiesTimeGoals = null
    updatedGuess.awayTeamPenaltiesTimeGoals = null
  }

  if (existingIndex >= 0) {
    guesses.data[existingIndex] = updatedGuess
  } else {
    guesses.data.push(updatedGuess)
  }

  // Create the modelValue format expected by parent
  // const modelValue: Record<number, iMatchGuess> = {}
  guesses.data.forEach((guess) => {
    const match = matches.data.find((m) => m.id === guess.matchId)
    if (match) {
      matchesGuesses.value[guess.matchId] = {
        ...guess,
        match,
      } as any
    }
  })

  // emit('update:modelValue', modelValue)
}

const handleViewOtherGuesses = (match: iMatch) => {
  emit('view-guesses', match)
}

// Initialize on mount
onMounted(() => {
  if (selectedRound.value?.id) {
    loadMatchesAndGuesses(selectedRound.value.id)
  }
})
</script>
<template>
  <div class="rounds-matches-list">
    <ChampionshipRoundSelector
      :selected-round="selectedRound"
      :selected-round-index="selectedRoundIndex"
      :total-rounds="rounds.length"
      :total-matches="matches.data.length"
      @previous-round="handlePreviousRound"
      @next-round="handleNextRound"
    />

    <RoundMatchesListSkeleton v-if="isLoading" />

    <BaseEmptyState
      v-else-if="hasNoMatches"
      title="Nenhum jogo encontrado"
      description="Esta rodada ainda não possui jogos cadastrados"
    />

    <div v-else class="space-y-4">
      <template v-for="match in orderedMatches" :key="match.id!">
        <MatchCardGuess
          v-if="['scheduled', 'postponed'].includes(match.status!)"
          :match="match"
          :guess="matchesGuessesMap[match.id!]"
          :memory-registered-guesses="memoryRegisteredGuesses"
          @update:guess="handleUpdateGuess"
          @view-guesses="handleViewOtherGuesses"
        />

        <MatchCardResult
          v-else
          :match="match"
          :guess="matchesGuessesMap[match.id!]"
          :memory-registered-guesses="memoryRegisteredGuesses"
          @update:guess="handleUpdateGuess"
          @view-guesses="handleViewOtherGuesses"
        />
      </template>
    </div>
  </div>
</template>
