<script setup lang="ts">
import type { iLeague } from '@/types'
import LeagueJoinedCardItem from './LeagueJoinedCardItem.vue'

defineProps<{
  leagues: iLeague[]
  loading: boolean
  loggedUserId?: number
}>()

const emit = defineEmits<{
  guesses: [league: iLeague]
  ranking: [league: iLeague]
  manage: [league: iLeague]
  edit: [league: iLeague]
  remove: [league: iLeague]
  leave: [league: iLeague]
}>()

const handleGuessesLeague = (league: iLeague) => {
  emit('guesses', league)
}

const handleRankingLeague = (league: iLeague) => {
  emit('ranking', league)
}

const handleManageLeague = (league: iLeague) => {
  emit('manage', league)
}

const handleEditLeague = (league: iLeague) => {
  emit('edit', league)
}

const handleRemoveLeague = (league: iLeague) => {
  emit('remove', league)
}

const handleLeaveLeague = (league: iLeague) => {
  emit('leave', league)
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="card-title text-lg">
        Minhas Ligas
        <div class="badge badge-primary">{{ leagues.length }}</div>
      </div>
      <p class="text-base-content/70 mb-4">Ligas das quais você participa</p>

      <div v-if="loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="leagues.length === 0" class="text-center py-8">
        <div class="text-base-content/50 mb-4">
          <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p class="text-lg font-medium">Você ainda não participa de nenhuma liga</p>
        <p class="text-sm text-base-content/70">Crie uma liga ou entre em uma liga pública</p>
      </div>

      <div v-else class="grid gap-4">
        <LeagueJoinedCardItem
          v-for="league in leagues"
          :key="league.id"
          :league="league"
          :logged-user-id="loggedUserId"
          @guesses="handleGuessesLeague"
          @ranking="handleRankingLeague"
          @manage="handleManageLeague"
          @edit="handleEditLeague"
          @remove="handleRemoveLeague"
          @leave="handleLeaveLeague"
        />
      </div>
    </div>
  </div>
</template>
