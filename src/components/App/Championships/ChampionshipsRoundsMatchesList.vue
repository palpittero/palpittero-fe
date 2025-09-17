<template>
  <div class="card bg-base-100 shadow-lg border border-base-300">
    <div class="card-body p-4">
      <!-- Championship header -->
      <div class="flex justify-between items-center cursor-pointer" @click="handleToggle">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold">{{ championship.name }}</h2>
          <div class="badge badge-primary">{{ championship.matches?.length || 0 }} jogos</div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-base-content/60">
            {{ isOpen ? 'Ocultar' : 'Mostrar' }}
          </span>
          <svg
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Championship content -->
      <div v-show="isOpen" class="mt-4 transition-all duration-300 ease-in-out">
        <!-- Championship guesses (champion/runner-up predictions) -->
        <ChampionshipGuesses
          v-model="championshipGuesses"
          :loading="isLoading"
          :championship-id="championship.id"
          :league-id="leagueId"
          :disabled="!enablePositionGuesses"
        />

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="space-y-4 mt-4">
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse flex space-x-4 p-4 bg-base-200 rounded-lg"
          >
            <div class="rounded-full bg-base-300 h-12 w-12"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 bg-base-300 rounded w-3/4"></div>
              <div class="h-4 bg-base-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Rounds matches list -->
        <RoundsMatchesList
          v-else-if="rounds.data.length > 0"
          v-model="matchesGuesses"
          :rounds="rounds.data"
          :league-id="leagueId"
          :memory-registered-guesses="memoryRegisteredGuesses"
        />

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <div class="text-base-content/50 mb-4">
            <svg
              class="w-16 h-16 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p class="text-lg font-medium">{{ emptyStateText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import services from '@/services'
import type { iChampionship, iChampionshipRound, iState } from '@/types'
import { useAuthStore } from '@/stores'
import ChampionshipGuesses from './ChampionshipGuesses.vue'
import RoundsMatchesList from './RoundsMatchesList.vue'

interface ChampionshipGuess {
  position: number
  team: any
  teamId?: number
  championshipId: number
  leagueId: number
  userId: number
}

const props = defineProps<{
  modelValue: Record<number, any>
  championship: iChampionship
  leagueId: number
  emptyState?: string
  memoryRegisteredGuesses?: number[]
  enablePositionGuesses?: boolean
  isOpen?: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [value: Record<number, any>]
  'update:championshipGuesses': [guesses: Record<number, ChampionshipGuess>]
}>()

const authStore = useAuthStore()

const isOpen = ref(props.isOpen ?? false)
const isLoading = ref(false)

const rounds = reactive<iState<iChampionshipRound[]>>({
  loading: false,
  data: [],
  error: null,
})

const championshipGuesses = ref<Record<number, ChampionshipGuess>>({})
const matchesGuesses = ref<Record<number, any>>(props.modelValue)

const emptyStateText = computed(
  () => props.emptyState || 'Nenhuma rodada encontrada para este campeonato',
)

// Load championship rounds and guesses
const loadChampionshipData = async () => {
  if (!props.championship.id) return

  try {
    isLoading.value = true

    // Load rounds
    rounds.data = await services.championships.fetchRounds(props.championship.id)

    // Load championship guesses if position guesses are enabled
    if (props.enablePositionGuesses && authStore.user?.id) {
      const championshipGuessesData = await services.championshipsGuesses.fetchChampionshipsGuesses(
        {
          championshipId: props.championship.id,
          leagueId: props.leagueId,
          userId: authStore.user.id,
        },
      )

      // Initialize championship guesses with default values
      championshipGuesses.value = {
        1: {
          position: 1,
          team: null,
          teamId: null,
          championshipId: props.championship.id,
          leagueId: props.leagueId,
          userId: authStore.user.id,
        },
        2: {
          position: 2,
          team: null,
          teamId: null,
          championshipId: props.championship.id,
          leagueId: props.leagueId,
          userId: authStore.user.id,
        },
        ...championshipGuessesData,
      }
    }
  } catch (error) {
    console.error('Error loading championship data:', error)
    rounds.error = error instanceof Error ? error : new Error('Unknown error')
  } finally {
    isLoading.value = false
  }
}

// Watch for championship guesses changes and emit
watch(
  championshipGuesses,
  (newGuesses) => {
    emits('update:championshipGuesses', newGuesses)
  },
  { deep: true },
)

// Watch for matches guesses changes and emit
watch(
  matchesGuesses,
  (newGuesses) => {
    emits('update:modelValue', newGuesses)
  },
  { deep: true },
)

const handleToggle = () => {
  isOpen.value = !isOpen.value
}

// Load data when component mounts
onMounted(() => {
  loadChampionshipData()
})
</script>

<style scoped>
.card {
  transition: all 0.2s ease-in-out;
}

/* .card:hover {
  @apply shadow-xl;
} */
</style>
