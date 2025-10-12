<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
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
  rounds: iChampionshipRound[]
  leagueId: number
  memoryRegisteredGuesses?: number[]
}>()

const emit = defineEmits<{
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

    matchesGuesses.value = matches.data.reduce(
      (acc, match) => ({
        ...acc,
        [match.id!]: getMatchGuess(match.id),
      }),
      {} as Record<number, iMatchGuess>,
    )

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

const getMatchGuess = (matchId?: number | null): iMatchGuess => {
  if (!matchId) return createEmptyGuess({ matchId: 0, leagueId: props.leagueId })

  const existingGuess = guesses.data.find((g) => g.matchId === matchId)
  if (existingGuess) return existingGuess

  return createEmptyGuess({ matchId, leagueId: props.leagueId })
}

const createEmptyGuess = ({
  matchId,
  leagueId,
}: {
  matchId: number
  leagueId: number
}): iMatchGuess => ({
  matchId,
  leagueId,
  homeTeamRegularTimeGoals: null,
  awayTeamRegularTimeGoals: null,
  homeTeamPenaltiesTimeGoals: null,
  awayTeamPenaltiesTimeGoals: null,
})

const handleViewOtherGuesses = (match: iMatch) => {
  emit('view-guesses', match)
}
</script>
<template>
  <div class="flex flex-col space-y-4">
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

    <template v-else>
      <template v-for="match in orderedMatches" :key="match.id!">
        <MatchCardGuess
          v-if="['scheduled', 'postponed'].includes(match.status!)"
          v-model="matchesGuesses[match.id!]"
          :match="match"
          :league-id="leagueId"
          :memory-registered-guesses="memoryRegisteredGuesses"
          @view-guesses="handleViewOtherGuesses"
        />

        <MatchCardResult
          v-else
          :match="match"
          :guess="matchesGuesses[match.id!]"
          :memory-registered-guesses="memoryRegisteredGuesses"
          @view-guesses="handleViewOtherGuesses"
        />
      </template>
    </template>
  </div>
</template>
