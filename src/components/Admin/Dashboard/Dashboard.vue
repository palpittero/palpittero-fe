<template>
  <UnprocessedGuessesFetcher>
    <template
      #default="{ data: { matchesGuesses, championshipsGuesses }, fetch }"
    >
      <UnprocessedGuessesBanner
        v-if="[...matchesGuesses, ...championshipsGuesses].length > 0"
        :guesses="[...matchesGuesses, ...championshipsGuesses]"
        @refresh="fetch"
      />
    </template>
  </UnprocessedGuessesFetcher>

  <GeneralStats :general-stats="generalStats.data" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import dashboard from '@/services/modules/dashboard'

import UnprocessedGuessesFetcher from '../Guesses/UnprocessedGuessesFetcher/UnprocessedGuessesFetcher.vue'
import UnprocessedGuessesBanner from '@/components/Admin/Guesses/UnprocessedGuessesBanner/UnprocessedGuessesBanner.vue'
import GeneralStats from './GeneralStats/GeneralStats.vue'

const generalStats = ref({
  loading: false,
  error: null,
  data: {}
})

onMounted(async () => {
  generalStats.value.loading = true
  generalStats.value.data = await dashboard.fetchGeneralStats()

  generalStats.value.loading = true
})
</script>
