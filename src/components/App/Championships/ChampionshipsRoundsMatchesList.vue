<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import services from '@/services'
import type {
  iChampionship,
  iChampionshipGuess,
  iChampionshipRound,
  iMatch,
  iState,
  iTeam,
} from '@/types'
import { useAuthStore } from '@/stores'
import ChampionshipPositionsGuesses from '@/components/App/Championships/ChampionshipPositionsGuesses.vue'
import RoundsMatchesList from './RoundsMatchesList.vue'
import { initChampionshipPositionsGuesses } from '@/helpers/guesses'
import BaseEmptyState from '@/components/Shared/BaseEmptyState.vue'
import ChampionshipGuessesHeader from './ChampionshipGuessesHeader.vue'
import ChampionshipRoundMatchesListSkeleton from './ChampionshipRoundMatchesListSkeleton.vue'

const props = defineProps<{
  championship: iChampionship
  leagueId: number
  memoryRegisteredGuesses?: number[]
  isOpen?: boolean
}>()

const authStore = useAuthStore()

const isOpen = ref(props.isOpen ?? false)
const isLoading = ref(false)

const rounds = reactive<iState<iChampionshipRound[]>>({
  loading: false,
  data: [],
  error: null,
})

const teams = reactive<iState<iTeam[]>>({
  loading: false,
  data: [],
  error: null,
})

const hasRounds = computed<boolean>(() => rounds.data.length > 0)

const championshipPositionsGuesses = defineModel<Record<number, iChampionshipGuess>>(
  'championship-positions-guesses',
  { required: true },
)
const matchesGuesses = defineModel<Record<number, any>>('matches-guesses', { required: true })

// Load championship rounds and guesses
const loadChampionshipData = async () => {
  if (!props.championship.id) return

  try {
    isLoading.value = true

    // Load rounds
    rounds.data = await services.championships.fetchRounds(props.championship.id)

    // Load teams
    teams.data = await services.championships.fetchTeams(props.championship.id)

    // Load championship guesses if position guesses are enabled
    if (props.championship.enableGuesses && authStore.loggedUser?.id) {
      const championshipGuessesData = await services.championshipsGuesses.fetchChampionshipsGuesses(
        {
          championshipId: props.championship.id,
          leagueId: props.leagueId,
          userId: authStore.loggedUser?.id,
        },
      )

      // Initialize championship guesses with default values
      championshipPositionsGuesses.value = initChampionshipPositionsGuesses({
        championshipId: props.championship.id,
        leagueId: props.leagueId,
        userId: authStore.loggedUser?.id,
        championshipGuesses: championshipGuessesData,
      })
    }
  } catch (error) {
    console.error('Error loading championship data:', error)
    rounds.error = error instanceof Error ? error : new Error('Unknown error')
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits<{
  'view-other-guesses': [match: iMatch]
  'view-other-championship-guesses': [championshipId: number]
}>()

const handleViewOtherGuesses = (match: iMatch) => {
  emit('view-other-guesses', match)
}

const handleViewOtherChampionshipGuesses = (championshipId: number) => {
  emit('view-other-championship-guesses', championshipId)
}

const handleToggle = () => {
  isOpen.value = !isOpen.value
}

onMounted(loadChampionshipData)
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body p-4">
      <!-- Championship header -->
      <ChampionshipGuessesHeader
        :is-open="isOpen"
        :championship="championship"
        @toggle="handleToggle"
      />

      <!-- Championship content -->
      <div v-if="isOpen" class="transition-all duration-300 ease-in-out">
        <!-- Championship guesses (champion/runner-up predictions) -->
        <ChampionshipPositionsGuesses
          v-model="championshipPositionsGuesses"
          :loading="isLoading"
          :championship="championship"
          :teams="teams.data"
          :league-id="leagueId"
          :disabled="!championship.enableGuesses"
          @view-other-championship-guesses="handleViewOtherChampionshipGuesses"
        />

        <!-- <pre>{{ matchesGuesses }}</pre> -->

        <!-- Loading skeleton -->
        <ChampionshipRoundMatchesListSkeleton v-if="isLoading" />

        <!-- Rounds matches list -->
        <RoundsMatchesList
          v-else-if="hasRounds"
          v-model="matchesGuesses"
          :rounds="rounds.data"
          :league-id="leagueId"
          :memory-registered-guesses="memoryRegisteredGuesses"
          @view-other-guesses="handleViewOtherGuesses"
        />

        <!-- Empty state -->
        <BaseEmptyState v-else title="Nenhuma rodada encontrada para este campeonato" />
      </div>
    </div>
  </div>
</template>
