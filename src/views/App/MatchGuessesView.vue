<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <div class="breadcrumbs text-sm">
      <ul>
        <li><router-link to="/" class="link link-hover">Home</router-link></li>
        <li>
          <router-link
            :to="{ name: 'app.guesses', params: { leagueId } }"
            class="link link-hover"
            >{{ league.data.name || 'Liga' }}</router-link
          >
        </li>
        <li>Palpite do Jogo</li>
      </ul>
    </div>

    <!-- Page Header -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
              <span class="text-primary text-3xl">⚽</span>
              Palpite do Jogo
            </h1>
            <p class="text-base-content/70 mt-1">Liga: {{ league.data.name || 'Carregando...' }}</p>
          </div>

          <div class="flex gap-2">
            <button
              class="btn btn-primary gap-2"
              :disabled="isLoading || !isValidGuess"
              @click="handleSaveGuess"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Salvar Palpite
            </button>
            <router-link
              :to="{ name: 'app.guesses', params: { leagueId } }"
              class="btn btn-secondary"
            >
              Voltar
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="match.loading || league.loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Match Information & Guess Form -->
    <div v-else class="grid gap-6">
      <!-- Match Details -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4">
            <span class="text-primary">📅</span>
            Informações do Jogo
          </h2>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <div class="stat bg-base-200/50 rounded-box">
                <div class="stat-title">Campeonato</div>
                <div class="stat-value text-lg">{{ match.data.championship?.name || 'N/A' }}</div>
              </div>
            </div>
            <div>
              <div class="stat bg-base-200/50 rounded-box">
                <div class="stat-title">Rodada</div>
                <div class="stat-value text-lg">{{ match.data.round?.name || 'N/A' }}</div>
              </div>
            </div>
            <div>
              <div class="stat bg-base-200/50 rounded-box">
                <div class="stat-title">Data</div>
                <div class="stat-value text-lg">{{ formatMatchDate(match.data.date) }}</div>
              </div>
            </div>
            <div>
              <div class="stat bg-base-200/50 rounded-box">
                <div class="stat-title">Status</div>
                <div class="stat-value text-lg">
                  <div class="badge" :class="getStatusBadgeClass(match.data.status)">
                    {{ getStatusText(match.data.status) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Guess Form -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-lg mb-6">
            <span class="text-accent">🎯</span>
            Seu Palpite
          </h2>

          <!-- Teams and Score Input -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <!-- Home Team -->
            <div class="text-center md:col-span-2">
              <div class="avatar mb-3">
                <div class="w-16 rounded-full bg-base-200">
                  <img
                    v-if="match.data.homeTeam?.logo"
                    :src="match.data.homeTeam.logo"
                    :alt="match.data.homeTeam.name"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-2xl">
                    🏠
                  </div>
                </div>
              </div>
              <h3 class="font-bold text-lg">{{ match.data.homeTeam?.name || 'Time da Casa' }}</h3>
            </div>

            <!-- Score Input -->
            <div class="text-center">
              <div class="flex items-center justify-center gap-2">
                <input
                  v-model.number="guess.homeTeamGoals"
                  type="number"
                  min="0"
                  max="20"
                  class="input input-bordered w-16 text-center font-bold text-xl"
                  :disabled="isLoading || !canMakeGuess"
                  placeholder="0"
                />
                <span class="text-2xl font-bold text-base-content/50">×</span>
                <input
                  v-model.number="guess.awayTeamGoals"
                  type="number"
                  min="0"
                  max="20"
                  class="input input-bordered w-16 text-center font-bold text-xl"
                  :disabled="isLoading || !canMakeGuess"
                  placeholder="0"
                />
              </div>
              <p class="text-xs text-base-content/60 mt-1">Tempo Regular</p>
            </div>

            <!-- Away Team -->
            <div class="text-center md:col-span-2">
              <div class="avatar mb-3">
                <div class="w-16 rounded-full bg-base-200">
                  <img
                    v-if="match.data.awayTeam?.logo"
                    :src="match.data.awayTeam.logo"
                    :alt="match.data.awayTeam.name"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-2xl">
                    🛫
                  </div>
                </div>
              </div>
              <h3 class="font-bold text-lg">{{ match.data.awayTeam?.name || 'Time Visitante' }}</h3>
            </div>
          </div>

          <!-- Penalties Input (if applicable) -->
          <div v-if="needsPenaltiesGuess" class="mt-8">
            <div class="divider">Disputa de Pênaltis</div>
            <div class="flex items-center justify-center gap-4">
              <div class="text-center">
                <label class="label">
                  <span class="label-text">{{ match.data.homeTeam?.name }}</span>
                </label>
                <input
                  v-model.number="guess.homeTeamPenalties"
                  type="number"
                  min="0"
                  max="10"
                  class="input input-bordered w-16 text-center font-bold text-xl"
                  :disabled="isLoading || !canMakeGuess"
                  placeholder="0"
                />
              </div>
              <span class="text-xl font-bold text-base-content/50 mt-6">×</span>
              <div class="text-center">
                <label class="label">
                  <span class="label-text">{{ match.data.awayTeam?.name }}</span>
                </label>
                <input
                  v-model.number="guess.awayTeamPenalties"
                  type="number"
                  min="0"
                  max="10"
                  class="input input-bordered w-16 text-center font-bold text-xl"
                  :disabled="isLoading || !canMakeGuess"
                  placeholder="0"
                />
              </div>
            </div>
            <p class="text-xs text-base-content/60 text-center mt-2">
              * Obrigatório para jogos eliminatórios
            </p>
          </div>

          <!-- Guess Validation -->
          <div v-if="!canMakeGuess" class="alert alert-warning mt-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Palpites não são mais aceitos para este jogo</span>
          </div>

          <div v-else-if="!isValidGuess" class="alert alert-error mt-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ validationMessage }}</span>
          </div>

          <!-- Points Information -->
          <div class="alert alert-info mt-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 class="font-bold">Sistema de Pontuação:</h3>
              <div class="text-sm space-y-1">
                <p>• Placar exato: <strong>5 pontos</strong></p>
                <p>• Vencedor + um placar correto: <strong>4 pontos</strong></p>
                <p>• Vencedor + placar do perdedor: <strong>3 pontos</strong></p>
                <p>• Apenas vencedor: <strong>2 pontos</strong></p>
                <p>• Pelo menos um placar: <strong>1 ponto</strong></p>
              </div>
            </div>
          </div>
        </div>
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
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import services from '@/services'
import { useToastStore, useAuthStore } from '@/stores'

const route = useRoute()
const toastStore = useToastStore()
const authStore = useAuthStore()

// Reactive data
const league = reactive({
  loading: false,
  data: {} as any,
})

const match = reactive({
  loading: false,
  data: {} as any,
})

const guess = ref({
  homeTeamGoals: null as number | null,
  awayTeamGoals: null as number | null,
  homeTeamPenalties: null as number | null,
  awayTeamPenalties: null as number | null,
})

const isLoading = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')

// Computed properties
const leagueId = computed(() => Number(route.params.leagueId))
const matchId = computed(() => Number(route.params.matchId))

const canMakeGuess = computed(() => {
  return match.data.status === 'SCHEDULED'
})

const needsPenaltiesGuess = computed(() => {
  return match.data.round?.type === 'PENALTIES' || match.data.round?.type === 'EXTRA_TIME'
})

const isValidGuess = computed(() => {
  // Must have regular time goals
  if (guess.value.homeTeamGoals === null || guess.value.awayTeamGoals === null) {
    return false
  }

  // Must have penalties if needed
  if (needsPenaltiesGuess.value) {
    if (guess.value.homeTeamPenalties === null || guess.value.awayTeamPenalties === null) {
      return false
    }
    // Penalties can't be tied
    if (guess.value.homeTeamPenalties === guess.value.awayTeamPenalties) {
      return false
    }
  }

  return true
})

const validationMessage = computed(() => {
  if (guess.value.homeTeamGoals === null || guess.value.awayTeamGoals === null) {
    return 'Informe o placar do tempo regular'
  }

  if (needsPenaltiesGuess.value) {
    if (guess.value.homeTeamPenalties === null || guess.value.awayTeamPenalties === null) {
      return 'Informe o placar dos pênaltis'
    }
    if (guess.value.homeTeamPenalties === guess.value.awayTeamPenalties) {
      return 'Disputa de pênaltis não pode terminar empatada'
    }
  }

  return ''
})

// Methods
const loadData = async () => {
  try {
    await Promise.all([loadLeague(), loadMatch(), loadExistingGuess()])
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const loadLeague = async () => {
  league.loading = true
  try {
    league.data = await services.leagues.fetchLeagueById(leagueId.value)
  } catch (error) {
    console.error('Error loading league:', error)
    toastStore.error('Erro ao carregar dados da liga')
  } finally {
    league.loading = false
  }
}

const loadMatch = async () => {
  match.loading = true
  try {
    match.data = await services.matches.fetchMatchById(matchId.value)
  } catch (error) {
    console.error('Error loading match:', error)
    toastStore.error('Erro ao carregar dados do jogo')
  } finally {
    match.loading = false
  }
}

const loadExistingGuess = async () => {
  try {
    const params = {
      leagueId: leagueId.value,
      matchId: matchId.value,
      userId: authStore.loggedUser?.id,
    }
    const existingGuesses = await services.guesses.fetchMyGuesses(params)

    if (existingGuesses && existingGuesses.length > 0) {
      const existingGuess = existingGuesses[0]
      guess.value = {
        homeTeamGoals: existingGuess.homeTeamRegularTimeGoals || null,
        awayTeamGoals: existingGuess.awayTeamRegularTimeGoals || null,
        homeTeamPenalties: existingGuess.homeTeamPenaltiesTimeGoals || null,
        awayTeamPenalties: existingGuess.awayTeamPenaltiesTimeGoals || null,
      }
    }
  } catch (error) {
    console.error('Error loading existing guess:', error)
  }
}

const formatMatchDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    SCHEDULED: 'Agendado',
    LIVE: 'Ao vivo',
    FINISHED: 'Finalizado',
    POSTPONED: 'Adiado',
    CANCELLED: 'Cancelado',
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    SCHEDULED: 'badge-info',
    LIVE: 'badge-success',
    FINISHED: 'badge-neutral',
    POSTPONED: 'badge-warning',
    CANCELLED: 'badge-error',
  }
  return classMap[status] || 'badge-neutral'
}

const handleSaveGuess = async () => {
  try {
    isLoading.value = true

    const matchGuess = {
      matchId: matchId.value,
      leagueId: leagueId.value,
      userId: authStore.loggedUser?.id,
      homeTeamRegularTimeGoals: guess.value.homeTeamGoals,
      awayTeamRegularTimeGoals: guess.value.awayTeamGoals,
      homeTeamPenaltiesTimeGoals: guess.value.homeTeamPenalties,
      awayTeamPenaltiesTimeGoals: guess.value.awayTeamPenalties,
    }

    await services.guesses.registerGuesses({
      matchesGuesses: [matchGuess],
      championshipsGuesses: [],
    })

    toastStore.success('Palpite salvo com sucesso!')
  } catch (error) {
    console.error('Error saving guess:', error)
    toastStore.error('Erro ao salvar palpite')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
