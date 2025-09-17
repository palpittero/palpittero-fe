<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <div class="breadcrumbs text-sm">
      <ul>
        <li>
          <router-link to="/" class="link link-hover">Home</router-link>
        </li>
        <li v-if="league.data.name">{{ league.data.name }}</li>
        <li>Palpites</li>
      </ul>
    </div>

    <!-- Sticky Header -->
    <div
      class="sticky top-0 bg-base-100/95 backdrop-blur-sm z-10 p-4 -m-4 rounded-lg border border-base-300"
    >
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
            <span class="text-primary text-3xl md:text-4xl">🏆</span>
            {{ league.data.name || 'Carregando...' }}
          </h1>
        </div>

        <div class="flex gap-2">
          <button
            class="btn btn-primary gap-2"
            :disabled="isRegisterGuessesDisabled"
            @click="handleRegisterGuesses"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span class="hidden sm:inline">Registrar Palpites</span>
          </button>
          <button class="btn btn-secondary gap-2" :disabled="isLoading" @click="handleCopyGuesses">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span class="hidden sm:inline">Copiar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="championships.loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Championships List -->
    <div v-else class="space-y-6">
      <ChampionshipsRoundsMatchesList
        v-for="(championship, index) in championships.data"
        :key="championship.id"
        v-model="matchesGuesses[championship.id]"
        :championship="championship"
        :league-id="leagueId"
        :is-open="isChampionshipOpen(index)"
        :enable-position-guesses="!!championship.enableGuesses"
        :memory-registered-guesses="memoryRegisteredGuesses"
        :empty-state="'Nenhuma rodada encontrada para este campeonato'"
        @update:championship-guesses="handleUpdateChampionshipGuesses"
      />

      <div v-if="championships.data.length === 0" class="text-center py-12">
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
        <p class="text-lg font-medium">Nenhum campeonato encontrado</p>
        <p class="text-sm text-base-content/70">
          Esta liga ainda não possui campeonatos para palpitar
        </p>
      </div>
    </div>
  </div>

  <!-- Success Toast -->
  <div v-if="showSuccessToast" class="toast toast-top toast-end z-50">
    <div class="alert alert-success">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>{{ toastMessage }}</span>
    </div>
  </div>

  <!-- Copy Guesses Modal -->
  <CopyGuessesModal
    v-if="isCopyGuessesModalOpen"
    :visible="isCopyGuessesModalOpen"
    :league="league.data"
    :championships="championships.data"
    @submit="handleCopyGuessesSubmit"
    @hide="handleCopyGuessesModalHide"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import services from '@/services'
import { useToastStore } from '@/stores'
import ChampionshipsRoundsMatchesList from '@/components/App/Championships/ChampionshipsRoundsMatchesList.vue'
import CopyGuessesModal from '@/components/App/Guesses/CopyGuessesModal.vue'

const route = useRoute()
const toastStore = useToastStore()

// Types
interface League {
  id: number
  name: string
}

interface Championship {
  id: number
  name: string
  enableGuesses?: boolean
  matches?: Array<{ id: number; name: string }>
}

// Reactive data
const league = reactive({
  loading: false,
  error: null as Error | null,
  data: {} as League,
})

const championships = reactive({
  loading: false,
  error: null as Error | null,
  data: [] as Championship[],
})

const matchesGuesses = ref<Record<string, any>>({})
const championshipsGuesses = ref<any[]>([])
const isLoading = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')
const openChampionships = ref<Set<number>>(new Set([0])) // Open first championship by default
const isCopyGuessesModalOpen = ref(false)
const memoryRegisteredGuesses = ref<number[]>([])

// Computed properties
const leagueId = computed(() => Number(route.params.leagueId))

const guesses = computed(() => {
  const allGuesses: any[] = []

  // Extract matches guesses
  Object.values(matchesGuesses.value).forEach((championshipGuesses: any) => {
    Object.values(championshipGuesses).forEach((guess: any) => {
      if (guess && guess.matchId) {
        allGuesses.push({
          ...guess,
          leagueId: leagueId.value,
        })
      }
    })
  })

  // Filter valid guesses (scheduled matches only)
  return allGuesses.filter((guess: any) => {
    return guess.leagueId && guess.matchId && (!guess.match || guess.match?.status === 'scheduled')
  })
})

const hasInvalidGuesses = computed(() => {
  // Check if there are any championships that enable guesses but have no position guesses
  const hasEnabledChampionships = championships.data.some((c) => c.enableGuesses)

  if (!hasEnabledChampionships && guesses.value.length === 0) {
    return true
  }

  // Check if any guess has invalid data
  return guesses.value.some((guess: any) => {
    const hasRegularTimeGoals =
      guess.homeTeamRegularTimeGoals !== null && guess.awayTeamRegularTimeGoals !== null

    if (!hasRegularTimeGoals) return true

    // Check penalties validation for draw games
    const isDraw = guess.homeTeamRegularTimeGoals === guess.awayTeamRegularTimeGoals
    const hasPenaltiesRound =
      guess.match?.round?.type === 'penalties' || guess.match?.round?.type === 'extra_time'

    if (isDraw && hasPenaltiesRound) {
      const hasPenalties =
        guess.homeTeamPenaltiesTimeGoals !== null && guess.awayTeamPenaltiesTimeGoals !== null
      const penaltiesDraw = guess.homeTeamPenaltiesTimeGoals === guess.awayTeamPenaltiesTimeGoals

      return !hasPenalties || penaltiesDraw
    }

    return false
  })
})

const isRegisterGuessesDisabled = computed(() => hasInvalidGuesses.value || isLoading.value)

// Methods
const loadLeagueData = async () => {
  try {
    league.loading = true
    league.data = await services.leagues.fetchLeagueById(leagueId.value)
  } catch (error: any) {
    console.error('Error loading league:', error)
    league.error = error
    toastStore.error('Erro ao carregar dados da liga')
  } finally {
    league.loading = false
  }
}

const loadChampionships = async () => {
  try {
    championships.loading = true
    championships.data = await services.leagues.fetchChampionships(leagueId.value)
  } catch (error: any) {
    console.error('Error loading championships:', error)
    championships.error = error
    toastStore.error('Erro ao carregar campeonatos')
  } finally {
    championships.loading = false
  }
}

const isChampionshipOpen = (index: number) => {
  return openChampionships.value.has(index)
}

const handleUpdateChampionshipGuesses = (championshipGuesses: any) => {
  // Add unique championship guesses to the array
  const newGuesses = Object.values(championshipGuesses)

  // Remove old guesses for this championship/league/user combination
  const filteredGuesses = championshipsGuesses.value.filter((guess: any) => {
    return !newGuesses.some(
      (newGuess: any) =>
        newGuess.championshipId === guess.championshipId &&
        newGuess.leagueId === guess.leagueId &&
        newGuess.userId === guess.userId &&
        newGuess.position === guess.position,
    )
  })

  // Add the new guesses
  championshipsGuesses.value = [...filteredGuesses, ...newGuesses]
}

const handleRegisterGuesses = async () => {
  try {
    isLoading.value = true

    // Store which matches are being registered
    memoryRegisteredGuesses.value = guesses.value.map((guess: any) => guess.matchId)

    const result = await services.guesses.registerGuesses({
      matchesGuesses: guesses.value,
      championshipsGuesses: championshipsGuesses.value,
    })

    const total = result?.data?.total || result?.total || 0
    showToast(`${total} palpites registrados com sucesso!`)

    // Reload data to get updated guesses
    await loadChampionships()
  } catch (error) {
    console.error('Error registering guesses:', error)
    showToast('Erro ao registrar palpites', true)
  } finally {
    isLoading.value = false
  }
}

const handleCopyGuesses = () => {
  isCopyGuessesModalOpen.value = true
}

const handleCopyGuessesModalHide = () => {
  isCopyGuessesModalOpen.value = false
}

const handleCopyGuessesSubmit = async (copyData: any) => {
  try {
    isLoading.value = true

    const result = await services.guesses.copyGuesses({
      sourceLeagueId: copyData.sourceLeagueId,
      targetLeagueId: copyData.targetLeagueId,
      championshipsIds: copyData.championshipsIds,
      copyMatchesGuesses: copyData.copyMatchesGuesses,
      copyChampionshipsGuesses: copyData.copyChampionshipsGuesses,
    })

    const total = result?.data?.total || result?.total || 0
    showToast(
      total > 0 ? `${total} palpites copiados com sucesso!` : 'Nenhum palpite foi copiado',
      total === 0,
    )

    handleCopyGuessesModalHide()

    // Reload championships data to show updated guesses
    if (total > 0) {
      await loadChampionships()
    }
  } catch (error) {
    console.error('Error copying guesses:', error)
    showToast('Erro ao copiar palpites', true)
  } finally {
    isLoading.value = false
  }
}

const showToast = (message: string, isError = false) => {
  toastMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 4000)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadLeagueData(), loadChampionships()])

  // Initialize matches guesses structure
  matchesGuesses.value = championships.data.reduce(
    (result, championship) => ({
      ...result,
      [championship.id]: reactive({}),
    }),
    {},
  )
})
</script>
