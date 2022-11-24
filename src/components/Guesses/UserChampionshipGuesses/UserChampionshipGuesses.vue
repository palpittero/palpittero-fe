<template>
  <BaseDataRenderer :state="{ loading }">
    <div class="mb-3">
      <h1 class="mb-0">{{ league.name }}</h1>
    </div>
    <UserChampionshipGuessesList
      :championship="championshipGuesses"
      :league="league"
      readonly
      open
    />
  </BaseDataRenderer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import services from '@/services'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import UserChampionshipGuessesList from '@/components/Shared/Guesses/UserChampionshipGuessesList/UserChampionshipGuessesList.vue'
import { parseChampionshipsGuesses } from '@/helpers/guesses'

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  },
  championshipId: {
    type: Number,
    required: true
  }
})

const championship = ref([])
const league = ref(null)
const guesses = ref([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  championship.value = await services.championships.fetchChampionshipById(
    props.championshipId
  )
  league.value = await services.leagues.fetchLeagueById(props.leagueId)
  guesses.value = await services.championshipsGuesses.fetchChampionshipsGuesses(
    {
      leagueId: props.leagueId,
      championshipId: props.championshipId
    }
  )
  loading.value = false
})

const championshipGuesses = computed(
  () => parseChampionshipsGuesses(guesses.value)[0]
)
</script>
