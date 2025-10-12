<script setup lang="ts">
import { map } from 'lodash/fp'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import services from '@/services'
import { useAuthStore, useToastStore } from '@/stores'
import type {
  iLeague,
  iChampionship,
  iState,
  iChampionshipGuess,
  iMatchGuess,
  iMatch,
  iCopyGuesses,
} from '@/types'
import ChampionshipsRoundsMatchesList from '@/components/App/Championships/ChampionshipsRoundsMatchesList.vue'
import CopyGuessesModalForm from '@/components/App/Guesses/CopyGuessesModalForm.vue'
import type { iBreadcrumbItem } from '@/components/Shared/PageBreadcrumbs.vue'
import PageBreadcrumbs from '@/components/Shared/PageBreadcrumbs.vue'
import GuessesHeader from '@/components/App/Guesses/GuessesHeader.vue'
import { hasInvalidMatchesGuesses, prepareChampionshipsGuesses } from '@/helpers/guesses'
import BaseEmptyState from '@/components/Shared/BaseEmptyState.vue'
import MatchGuessesModal from '@/components/App/Guesses/MatchGuessesModal.vue'
import ChampionshipGuessesModal from '@/components/App/Guesses/ChampionshipGuessesModal.vue'
import { storeToRefs } from 'pinia'

const route = useRoute()
const toastStore = useToastStore()
const authStore = useAuthStore()
const { loggedUser } = storeToRefs(authStore)

const breadcrumbItems = computed<iBreadcrumbItem[]>(() => [
  {
    label: 'Home',
    to: { name: 'app.index' },
    icon: 'fa-solid fa-house',
  },
  {
    label: league.data?.name || '',
  },
  {
    label: 'Palpites',
  },
])

// League
const league = reactive<iState<iLeague>>({
  loading: false,
  error: null,
  data: {} as iLeague,
})

const leagueId = computed<number>(() => Number(route.params.leagueId))

const loadLeague = async () => {
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

// Championships
const championships = reactive<iState<iChampionship[]>>({
  loading: false,
  error: null,
  data: [],
})

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

const hasNoChampionships = computed<boolean>(() => championships.data.length === 0)

const openChampionships = ref<Set<number>>(new Set([0]))

const isChampionshipOpen = (index: number): boolean => openChampionships.value.has(index)

// Guesses
const championshipsMatchesGuesses = ref<Record<string, any>>({})
const championshipsPositionsGuesses = ref<Record<number, iChampionshipGuess>>({})
const memoryRegisteredGuesses = ref<number[]>([])

const matchesGuesses = computed<iMatchGuess[]>(() => {
  const allGuesses: any[] = []

  // Extract matches guesses
  Object.values(championshipsMatchesGuesses.value).forEach((championshipMatchesGuesses: any) => {
    Object.values(championshipMatchesGuesses).forEach((matchGuess: any) => {
      if (matchGuess && matchGuess.matchId) {
        allGuesses.push({
          ...matchGuess,
          homeTeamRegularTimeGoals: parseInt(String(matchGuess.homeTeamRegularTimeGoals)) || null,
          awayTeamRegularTimeGoals: parseInt(String(matchGuess.awayTeamRegularTimeGoals)) || null,
          homeTeamPenaltiesTimeGoals:
            parseInt(String(matchGuess.homeTeamPenaltiesTimeGoals)) || null,
          awayTeamPenaltiesTimeGoals:
            parseInt(String(matchGuess.awayTeamPenaltiesTimeGoals)) || null,
          leagueId: leagueId.value,
        })
      }
    })
  })

  // Filter valid guesses (scheduled matches only)
  return allGuesses.filter(
    (guess: any) =>
      guess.leagueId && guess.matchId && (!guess.match || guess.match?.status === 'scheduled'),
  )
})

const championshipsGuesses = computed(() =>
  prepareChampionshipsGuesses(championshipsPositionsGuesses.value),
)

const isSubmitting = ref<boolean>(false)

const isRegisterGuessesDisabled = computed<boolean>(
  () =>
    hasInvalidMatchesGuesses({
      championships: championships.data,
      matchesGuesses: matchesGuesses.value,
    }) || isSubmitting.value,
)

const handleRegisterGuesses = async () => {
  try {
    isSubmitting.value = true

    // Store which matches are being registered
    memoryRegisteredGuesses.value = matchesGuesses.value.map((guess: any) => guess.matchId)

    const payload = {
      matchesGuesses: matchesGuesses.value,
      championshipsGuesses: championshipsGuesses.value,
    }

    await services.guesses.registerGuesses(payload)

    const total = payload.matchesGuesses.length + payload.championshipsGuesses.length

    toastStore.success(`${total} palpites registrados com sucesso!`)

    // Reload data to get updated guesses
    // await loadChampionships()
  } catch (error) {
    console.error('Error registering guesses:', error)
    toastStore.error('Erro ao registrar palpites')
  } finally {
    isSubmitting.value = false
  }
}

// Copy Guesses
const isCopyingGuesses = ref<boolean>(false)

const handleCopyGuesses = () => {
  // @ts-ignore
  copy_guesses_modal.showModal()
}

const handleCopyGuessesSubmit = async ({
  sourceLeagueId,
  targetLeagueId,
  championships,
  copyMatchesGuesses,
  copyChampionshipsGuesses,
}: iCopyGuesses) => {
  try {
    isCopyingGuesses.value = true

    const result = await services.guesses.copyGuesses({
      sourceLeagueId,
      targetLeagueId,
      championshipsIds: map('id', championships),
      copyMatchesGuesses,
      copyChampionshipsGuesses,
    })

    const total = (result as any)?.data?.total || (result as any)?.total || 0
    toastStore.success(
      total > 0 ? `${total} palpite(s) copiado(s) com sucesso!` : 'Nenhum palpite foi copiado',
    )

    // @ts-ignore
    copy_guesses_modal.close()

    if (total > 0) {
      await loadChampionships()
    }
  } catch (error) {
    console.error('Error copying guesses:', error)
    toastStore.error('Erro ao copiar palpites')
  } finally {
    isCopyingGuesses.value = false
  }
}

// General
const mounting = ref<boolean>(false)

const initMatchesGuesses = () => {
  championshipsMatchesGuesses.value = championships.data.reduce(
    (result, championship) => ({
      ...result,
      [championship.id]: reactive({}),
    }),
    {},
  )
}

// Lifecycle
onMounted(async () => {
  mounting.value = true
  await Promise.all([loadLeague(), loadChampionships()])

  // Initialize matches guesses structure
  initMatchesGuesses()

  await nextTick()
  mounting.value = false
})

const isLoading = computed<boolean>(() => league.loading || championships.loading || mounting.value)

const selectedMatch = ref<iMatch | null>(null)

const handleViewOtherGuesses = (match: iMatch) => {
  selectedMatch.value = match
  // @ts-ignore
  match_guesses_modal.showModal()
}

const selectedChampionship = ref<iChampionship | null>(null)

const handleViewOtherChampionshipGuesses = (championship: iChampionship) => {
  selectedChampionship.value = { ...championship }
  // @ts-ignore
  championship_guesses_modal.showModal()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <PageBreadcrumbs :items="breadcrumbItems" />

    <!-- Sticky Header -->
    <GuessesHeader
      :league-name="league.data.name"
      :is-register-guesses-disabled="isRegisterGuessesDisabled"
      :is-loading="isLoading"
      @register-guesses="handleRegisterGuesses"
      @copy-guesses="handleCopyGuesses"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Championships List -->
    <div v-else class="space-y-2 pt-2">
      <ChampionshipsRoundsMatchesList
        v-for="(championship, index) in championships.data"
        :key="championship.id"
        v-model:matches-guesses="championshipsMatchesGuesses[championship.id!]"
        v-model:championship-positions-guesses="championshipsPositionsGuesses[championship.id!]"
        :championship="championship"
        :league-id="leagueId"
        :is-open="isChampionshipOpen(index)"
        :memory-registered-guesses="memoryRegisteredGuesses"
        @view-guesses="handleViewOtherGuesses"
        @view-championship-guesses="handleViewOtherChampionshipGuesses"
      />

      <BaseEmptyState
        v-if="hasNoChampionships"
        title="Nenhum campeonato encontrado"
        description="Esta liga ainda não possui campeonatos para palpitar"
      />

      <MatchGuessesModal :match="selectedMatch!" :league-id="leagueId" />

      <ChampionshipGuessesModal :championship="selectedChampionship" :league-id="leagueId" />
    </div>
  </div>

  <!-- Copy Guesses Modal -->
  <CopyGuessesModalForm
    :league="league.data"
    :championships="championships.data"
    :logged-user="loggedUser"
    @submit="handleCopyGuessesSubmit"
  />
</template>
