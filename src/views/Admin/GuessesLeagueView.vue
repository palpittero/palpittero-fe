<script setup lang="ts">
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'
import GuessesLeaguesTabs from '@/components/Admin/Guesses/GuessesLeaguesTabs.vue'

import services from '@/services'
import { useToastStore } from '@/stores'
import { type iLeague, type iState, type iUnprocessedGuess } from '@/types'

import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const toastStore = useToastStore()
const route = useRoute()

const leagueId = computed<number>(() => Number(route.params.leagueId))

const guesses = reactive<iState<iUnprocessedGuess | null>>({
  loading: true,
  error: null,
  data: null,
})

const loadGuesses = async () => {
  guesses.loading = true
  guesses.data = await services.dashboard.fetchUnprocessedGuesses({
    leagueId: leagueId.value,
  })
  guesses.loading = false
}

const hasGuesses = computed<boolean>(() => !!guesses.data?.matchesGuesses.length)

const league = reactive<iState<iLeague | null>>({
  loading: false,
  error: null,
  data: null,
})

const loadLeague = async () => {
  league.loading = true
  league.data = await services.leagues.fetchLeagueById(leagueId.value)
  league.loading = false
}

const selectedChampionship = ref<any>(null)

const processGuessesConfirmationMessage = computed<string>(() => {
  if (selectedChampionship.value) {
    return `Tem certeza que deseja processar os palpites do campeonato <b>${selectedChampionship.value?.name}</b> na liga <b>${league.data?.name}</b>?`
  }

  return `Tem certeza que deseja processar todos os palpites da liga <b>${league.data?.name}</b>?`
})

const handleProcessGuessesConfirmation = (championship?: any) => {
  selectedChampionship.value = championship
  // @ts-ignore
  process_championship_guesses_confirmation_modal.showModal()
}

const handleProcessGuesses = async () => {
  await services.guesses.processGuesses({
    leagueId: leagueId.value,
    championshipId: selectedChampionship.value?.id,
  })

  selectedChampionship.value = null
  toastStore.success('Palpites processados com sucesso')
  // @ts-ignore
  process_championship_guesses_confirmation_modal.close()

  loadGuesses()
}

const isLoading = computed(() => league.loading || guesses.loading)

onMounted(() => {
  loadLeague()
  loadGuesses()
})
</script>

<template>
  <div v-if="isLoading">
    <div class="loading loading-ring loading-xl" />
    Carregando...
  </div>
  <div v-else class="flex flex-col gap-4">
    <div class="flex flex-col lg:flex-row items-start gap-4 lg:items-center justify-between">
      <h1 class="text-xl font-bold flex gap-2 items-center">
        <i class="fa-solid fa-flag" />
        {{ league.data?.name }}
      </h1>
      <button class="btn btn-primary" v-if="hasGuesses" @click="handleProcessGuessesConfirmation()">
        <i class="fa-solid fa-bolt" />
        Processar Palpites
      </button>
    </div>

    <GuessesLeaguesTabs
      :guesses="guesses.data"
      @process-guesses="handleProcessGuessesConfirmation"
    />

    <ConfirmationModal
      id="process_championship_guesses_confirmation_modal"
      title="Atenção!"
      :message="processGuessesConfirmationMessage"
      @submit="handleProcessGuesses"
    />
  </div>
</template>
