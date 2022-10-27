<template>
  <UnprocessedGuessesFetcher>
    <BaseDataRenderer :state="{ loading: isLoading }">
      <template #default>
        <h1 class="mb-0">
          {{ $t('common.unprocessedGuesses') }} - {{ league.data.name }}
        </h1>
        <ChampionshipMatchesList
          v-for="championship in championships.data"
          :key="championship.id"
          :championship="championship"
        />
        <!-- <template #default="{ data: unprocessedGuesses }"> </template> -->
      </template>
    </BaseDataRenderer>
  </UnprocessedGuessesFetcher>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import services from '@/services'

import { parseGuessesChampionships } from '@/helpers/guesses'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import UnprocessedGuessesFetcher from '../UnprocessedGuessesFetcher/UnprocessedGuessesFetcher.vue'
import ChampionshipMatchesList from '@/components/Admin/Championships/ChampionshipMatchesList/ChampionshipMatchesList.vue'

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  }
})

const league = ref({
  error: null,
  data: null
})

const guesses = ref({
  error: null,
  data: []
})

const championships = ref([])

// const championships = ref({
//   error: null,
//   data: []
// })

const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  const { leagueId } = props

  league.value.data = await services.leagues.fetchLeagueById(leagueId)
  guesses.value.data = await services.dashboard.fetchUnprocessedGuesses({
    leagueId
  })
  // const leagueChampionships = await services.leagues.fetchChampionships(leagueId)
  championships.value.data = parseGuessesChampionships(guesses.value.data)
  console.log(championships.value.data)

  isLoading.value = false
})

// const filterUnprocessedGuesses = (unprocessedGuesses) =>
//   unprocessedGuesses.filter(({ league }) => league.id === props.leagueId)
</script>
