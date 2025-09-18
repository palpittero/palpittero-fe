<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import services from '@/services'
import { useToastStore } from '@/stores'
import type {
  iLeague,
  iChampionship,
  iState,
  iChampionshipGuess,
  iMatchGuess,
  iMatch,
} from '@/types'
import ChampionshipsRoundsMatchesList from '@/components/App/Championships/ChampionshipsRoundsMatchesList.vue'
import CopyGuessesModal from '@/components/App/Guesses/CopyGuessesModal.vue'
import type { iBreadcrumbItem } from '@/components/Shared/PageBreadcrumbs.vue'
import PageBreadcrumbs from '@/components/Shared/PageBreadcrumbs.vue'
import GuessesHeader from '@/components/App/Guesses/GuessesHeader.vue'
import { hasInvalidMatchesGuesses, prepareChampionshipsGuesses } from '@/helpers/guesses'
import BaseEmptyState from '@/components/Shared/BaseEmptyState.vue'
import MatchGuessesDialog from '@/components/App/Guesses/MatchGuessesDialog.vue'
import ChampionshipGuessesDialog from '@/components/App/Guesses/ChampionshipGuessesDialog.vue'

const route = useRoute()
const toastStore = useToastStore()

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

    console.log('guesses', matchesGuesses.value)

    const payload = {
      matchesGuesses: matchesGuesses.value,
      championshipsGuesses: prepareChampionshipsGuesses(championshipsPositionsGuesses.value),
    }

    await services.guesses.registerGuesses(payload)

    const total = payload.matchesGuesses.length + payload.championshipsGuesses.length

    toastStore.success(`${total} palpites registrados com sucesso!`)

    // Reload data to get updated guesses
    await loadChampionships()
  } catch (error) {
    console.error('Error registering guesses:', error)
    toastStore.error('Erro ao registrar palpites')
  } finally {
    isSubmitting.value = false
  }
}

// Copy Guesses
const isCopyGuessesModalOpen = ref<boolean>(false)

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

    const total = (result as any)?.data?.total || (result as any)?.total || 0
    toastStore.success(
      total > 0 ? `${total} palpites copiados com sucesso!` : 'Nenhum palpite foi copiado',
    )

    handleCopyGuessesModalHide()

    // Reload championships data to show updated guesses
    if (total > 0) {
      await loadChampionships()
    }
  } catch (error) {
    console.error('Error copying guesses:', error)
    toastStore.error('Erro ao copiar palpites')
  } finally {
    isLoading.value = false
  }
}

// General
const isLoading = ref<boolean>(false)

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
  isLoading.value = true
  await Promise.all([loadLeague(), loadChampionships()])

  // Initialize matches guesses structure
  initMatchesGuesses()

  await nextTick()
  isLoading.value = false
})

const selectedMatch = ref<iMatch | null>(null)

const handleViewOtherGuesses = (match: iMatch) => {
  selectedMatch.value = match
  // @ts-ignore
  match_guesses_dialog.showModal()
}

const selectedChampionshipId = ref<number | null>(null)

const handleViewOtherChampionshipGuesses = (championshipId: number) => {
  selectedChampionshipId.value = championshipId
  // @ts-ignore
  championship_guesses_dialog.showModal()
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
        @view-other-guesses="handleViewOtherGuesses"
        @view-other-championship-guesses="handleViewOtherChampionshipGuesses"
      />

      <BaseEmptyState
        v-if="hasNoChampionships"
        title="Nenhum campeonato encontrado"
        description="Esta liga ainda não possui campeonatos para palpitar"
      />

      <MatchGuessesDialog :match="selectedMatch" :league-id="leagueId" />

      <ChampionshipGuessesDialog :championship-id="selectedChampionshipId" :league-id="leagueId" />
    </div>
  </div>

  <!-- Copy Guesses Modal -->
  <CopyGuessesModal
    :visible="isCopyGuessesModalOpen"
    :league="league.data"
    :championships="championships.data"
    @submit="handleCopyGuessesSubmit"
    @hide="handleCopyGuessesModalHide"
  />
</template>
