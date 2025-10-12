<script setup lang="ts">
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'
import GuessesLeaguesList from '@/components/Admin/Guesses/GuessesLeaguesList.vue'
import services from '@/services'
import { useToastStore } from '@/stores'
import type { iGuessLeague, iState, iUnprocessedGuess } from '@/types'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const toastStore = useToastStore()

const unprocessedGuesses = reactive<iState<iUnprocessedGuess | null>>({
  loading: false,
  error: null,
  data: {
    matchesGuesses: [],
    championshipsGuesses: [],
  },
})

const loadUnprocessedGuesses = async () => {
  unprocessedGuesses.loading = true
  unprocessedGuesses.data = await services.dashboard.fetchUnprocessedGuesses()
  unprocessedGuesses.loading = false
}

const hasUnprocessedGuesses = computed<boolean>(() =>
  Boolean(
    unprocessedGuesses.data?.matchesGuesses.length ||
      unprocessedGuesses.data?.championshipsGuesses.length,
  ),
)

const router = useRouter()

const handleViewGuesses = (leagueId: number) => {
  router.push({
    name: 'admin.guesses-league',
    params: {
      leagueId,
    },
  })
}

const handleProcessAllGuessesConfirmation = () => {
  // @ts-ignore
  process_all_guesses_confirmation_modal.showModal()
}

const selectedLeague = ref<iGuessLeague | null>(null)

const processLeagueGuessesConfirmationMessage = computed<string>(
  () =>
    `Tem certeza que deseja processar os palpites da liga <b>${selectedLeague.value?.name}</b>?`,
)

const handleProcessLeagueGuessesConfirmation = (league: iGuessLeague) => {
  // @ts-ignore
  process_league_guesses_confirmation_modal.showModal()
  selectedLeague.value = { ...league }
}

const isProcessing = ref<boolean>(false)

const handleProcessGuesses = async () => {
  isProcessing.value = true
  await services.guesses.processGuesses({ leagueId: selectedLeague.value?.id })

  toastStore.success('Palpites processados com sucesso')
  // @ts-ignore
  process_all_guesses_confirmation_modal.close()
  // @ts-ignore
  process_league_guesses_confirmation_modal.close()

  loadUnprocessedGuesses()

  selectedLeague.value = null
  isProcessing.value = false
}

onMounted(loadUnprocessedGuesses)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col lg:flex-row items-start gap-4 lg:items-center justify-between">
      <h1 class="text-xl font-bold flex gap-2 items-center">
        <i class="fa-solid fa-comments" />
        Palpites não processados
      </h1>
      <button
        v-if="hasUnprocessedGuesses"
        class="btn btn-primary"
        @click="handleProcessAllGuessesConfirmation"
      >
        <i class="fa-solid fa-bolt" />
        Processar Todos os Palpites
      </button>
    </div>

    <GuessesLeaguesList
      :unprocessed-guesses="unprocessedGuesses"
      @view-guesses="handleViewGuesses"
      @process-guesses="handleProcessLeagueGuessesConfirmation"
    />

    <ConfirmationModal
      id="process_all_guesses_confirmation_modal"
      title="Atenção!"
      message="Tem certeza que deseja processar todos os palpites de todas as ligas?"
      @submit="handleProcessGuesses"
    />

    <ConfirmationModal
      id="process_league_guesses_confirmation_modal"
      title="Atenção!"
      :message="processLeagueGuessesConfirmationMessage"
      @submit="handleProcessGuesses"
    />
  </div>
</template>
