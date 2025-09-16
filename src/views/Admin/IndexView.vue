<script setup lang="ts">
import DashboardStats from '@/components/Admin/Dashboard/DashboardStats.vue'
import DashboardUnprocessedGuessesBanner from '@/components/Admin/Dashboard/DashboardUnprocessedGuessesBanner.vue'
import services from '@/services'
import type { iDashboardStats, iState } from '@/types'
import type { iUnprocessedGuess } from '@/types/guesses'
import { onMounted, reactive } from 'vue'

const generalStats = reactive<iState<iDashboardStats | null>>({
  loading: false,
  error: null,
  data: null,
})

const loadStats = async () => {
  generalStats.loading = true
  generalStats.data = await services.dashboard.fetchGeneralStats()
  generalStats.loading = false
}

const unprocessedGuesses = reactive<iState<iUnprocessedGuess | null>>({
  loading: false,
  error: null,
  data: null,
})

const loadUnprocessedGuesses = async () => {
  unprocessedGuesses.loading = true
  unprocessedGuesses.data = await services.dashboard.fetchUnprocessedGuesses()
  unprocessedGuesses.loading = false
}

onMounted(() => {
  loadStats()
  loadUnprocessedGuesses()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <DashboardUnprocessedGuessesBanner v-bind="unprocessedGuesses" />
    <DashboardStats v-bind="generalStats" />
  </div>
</template>
