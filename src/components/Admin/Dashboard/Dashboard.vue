<template>
  <UnprocessedGuessesBanner
    v-if="hasUnprocessedGuesses"
    :total="unprocessedGuesses"
    @refresh="loadData"
  />
  <GeneralStats :general-stats="generalStats" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import UnprocessedGuessesBanner from './UnprocessedGuessesBanner/UnprocessedGuessesBanner.vue'
import GeneralStats from './GeneralStats/GeneralStats.vue'
import services from '@/services'

import dashboard from '@/services/modules/dashboard'

const isLoading = ref(false)
const generalStats = ref({})
const unprocessedGuesses = ref(0)

const loadData = async () => {
  isLoading.value = true

  const [generalStatsResult, unprocessedGuessesResult] = await Promise.all([
    await dashboard.fetchGeneralStats(),
    await services.dashboard.fetchUnprocessedGuesses()
  ])

  generalStats.value = generalStatsResult
  unprocessedGuesses.value = unprocessedGuessesResult

  isLoading.value = false
}

onMounted(loadData)

const hasUnprocessedGuesses = computed(() => unprocessedGuesses.value > 0)
</script>
