<script setup lang="ts">
import type { iLeague } from '@/types'
import LeaguePublicCardItem from './LeaguePublicCardItem.vue'

defineProps<{
  leagues: iLeague[]
  loading: boolean
}>()

const emit = defineEmits<{
  join: [league: iLeague]
}>()

const handleJoinLeague = (league: iLeague) => {
  emit('join', league)
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="card-title text-lg">
        Ligas Públicas
        <div class="badge badge-secondary">{{ leagues.length }}</div>
      </div>
      <p class="text-base-content/70 mb-4">Ligas abertas para participação</p>

      <div v-if="loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-secondary"></span>
      </div>

      <div v-else-if="leagues.length === 0" class="text-center py-8">
        <div class="text-base-content/50 mb-4">
          <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
            />
          </svg>
        </div>
        <p class="text-lg font-medium">Nenhuma liga pública encontrada</p>
        <p class="text-sm text-base-content/70">Que tal criar a primeira?</p>
      </div>

      <div v-else class="grid gap-4">
        <LeaguePublicCardItem
          v-for="league in leagues"
          :key="league.id"
          :league="league"
          @join="handleJoinLeague"
        />
      </div>
    </div>
  </div>
</template>
