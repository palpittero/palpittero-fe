<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <div class="breadcrumbs text-sm">
      <ul>
        <li><router-link to="/" class="link link-hover">Home</router-link></li>
        <li><router-link :to="{ name: 'app.guesses', params: { leagueId } }" class="link link-hover">{{ league.data.name || 'Liga' }}</router-link></li>
        <li>{{ championship.data.name || 'Campeonato' }}</li>
        <li>Palpites</li>
      </ul>
    </div>

    <!-- Page Header -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
              <span class="text-primary text-3xl">🏆</span>
              {{ championship.data.name || 'Carregando...' }}
            </h1>
            <p class="text-base-content/70 mt-1">
              Liga: {{ league.data.name || 'Carregando...' }}
            </p>
          </div>

          <div class="flex gap-2">
            <button
              class="btn btn-primary gap-2"
              :disabled="isLoading"
              @click="handleSaveGuesses"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Salvar Palpites
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
    <div v-if="championship.loading || league.loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Championship Guesses Form -->
    <div v-else class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-lg mb-4">
          <span class="text-accent">🥇</span>
          Palpites de Posições Finais
        </h2>

        <div v-if="championship.data.enableGuesses" class="space-y-6">
          <!-- Champion Prediction -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Campeão</span>
            </label>
            <select
              v-model="guesses.champion"
              class="select select-bordered w-full"
              :disabled="isLoading"
            >
              <option value="">Selecione o campeão</option>
              <option
                v-for="team in availableTeams"
                :key="team.id"
                :value="team.id"
              >
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- Runner-up Prediction -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Vice-campeão</span>
            </label>
            <select
              v-model="guesses.runnerUp"
              class="select select-bordered w-full"
              :disabled="isLoading"
            >
              <option value="">Selecione o vice-campeão</option>
              <option
                v-for="team in availableTeams"
                :key="team.id"
                :value="team.id"
                :disabled="team.id === guesses.champion"
              >
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- Points Information -->
          <div class="alert alert-info">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-bold">Pontuação:</h3>
              <p class="text-sm">• Campeão + Vice-campeão corretos: <strong>10 pontos</strong></p>
              <p class="text-sm">• Apenas campeão OU vice-campeão correto: <strong>5 pontos</strong></p>
              <p class="text-sm">• Nenhum acerto: <strong>0 pontos</strong></p>
            </div>
          </div>

          <!-- Current Guesses Summary -->
          <div v-if="guesses.champion || guesses.runnerUp" class="card bg-base-200/50">
            <div class="card-body p-4">
              <h3 class="font-semibold mb-3">Seus Palpites:</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div v-if="guesses.champion" class="text-center">
                  <div class="badge badge-primary badge-lg mb-2">🥇 CAMPEÃO</div>
                  <div class="font-bold text-lg">{{ getTeamName(guesses.champion) }}</div>
                </div>
                <div v-if="guesses.runnerUp" class="text-center">
                  <div class="badge badge-secondary badge-lg mb-2">🥈 VICE</div>
                  <div class="font-bold text-lg">{{ getTeamName(guesses.runnerUp) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="text-base-content/50 mb-4">
            <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p class="text-lg font-medium">Palpites desabilitados</p>
          <p class="text-sm text-base-content/70">Este campeonato não permite palpites de posições finais</p>
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
  data: {} as any
})

const championship = reactive({
  loading: false,
  data: {} as any
})

const guesses = ref({
  champion: '',
  runnerUp: ''
})

const isLoading = ref(false)
const showSuccessToast = ref(false)
const toastMessage = ref('')

// Computed properties
const leagueId = computed(() => Number(route.params.leagueId))
const championshipId = computed(() => Number(route.params.championshipId))

const availableTeams = computed(() => {
  // TODO: Get teams from championship data
  return (championship.data as any)?.teams || []
})

// Methods
const loadData = async () => {
  try {
    await Promise.all([
      loadLeague(),
      loadChampionship(),
      loadExistingGuesses()
    ])
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

const loadChampionship = async () => {
  championship.loading = true
  try {
    const champ = await services.championships.fetchChampionshipById(championshipId.value)
    const teams = await services.championships.fetchTeams(championshipId.value)
    championship.data = {
      ...champ,
      teams
    }
  } catch (error) {
    console.error('Error loading championship:', error)
    toastStore.error('Erro ao carregar dados do campeonato')
  } finally {
    championship.loading = false
  }
}

const loadExistingGuesses = async () => {
  try {
    const existingGuesses = await services.championshipsGuesses.fetchChampionshipsGuesses({
      userId: authStore.loggedUser?.id || 0,
      championshipId: championshipId.value,
      leagueId: leagueId.value
    })

    if (existingGuesses && existingGuesses.length > 0) {
      // Map existing guesses to champion/runner-up format
      const championGuess = existingGuesses.find((g: any) => g.position === 1)
      const runnerUpGuess = existingGuesses.find((g: any) => g.position === 2)

      guesses.value = {
        champion: championGuess?.teamId?.toString() || '',
        runnerUp: runnerUpGuess?.teamId?.toString() || ''
      }
    }
  } catch (error) {
    console.error('Error loading existing guesses:', error)
  }
}

const getTeamName = (teamId: string | number) => {
  const team = availableTeams.value.find((t: any) => t.id == teamId)
  return team ? team.name : ''
}

const handleSaveGuesses = async () => {
  if (!guesses.value.champion && !guesses.value.runnerUp) {
    toastStore.error('Selecione pelo menos uma posição para salvar')
    return
  }

  try {
    isLoading.value = true

    const championshipGuesses = []
    if (guesses.value.champion) {
      championshipGuesses.push({
        teamId: Number(guesses.value.champion),
        position: 1
      })
    }
    if (guesses.value.runnerUp) {
      championshipGuesses.push({
        teamId: Number(guesses.value.runnerUp),
        position: 2
      })
    }

    await services.championshipsGuesses.createChampionshipGuesses(
      championshipGuesses,
      {
        leagueId: leagueId.value,
        championshipId: championshipId.value,
        userId: authStore.loggedUser?.id || 0
      }
    )

    toastStore.success('Palpites salvos com sucesso!')
  } catch (error) {
    console.error('Error saving guesses:', error)
    toastStore.error('Erro ao salvar palpites')
  } finally {
    isLoading.value = false
  }
}


// Lifecycle
onMounted(() => {
  loadData()
})
</script>