<script setup lang="ts">
import type { iLeague } from '@/types'
import LeaguesCardItem from './LeagueJoinedCardItem.vue'

defineProps<{
  description: string
  leagues: iLeague[]
  loading: boolean
  title: string
  loggedUserId?: number
}>()
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="card-title text-lg">
        {{ title }}
        <div class="badge badge-primary">{{ leagues.length }}</div>
      </div>
      <p class="text-base-content/70 mb-4">{{ description }}</p>

      <div v-if="loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="leagues.length === 0" class="text-center py-8">
        <slot name="empty-state" />
      </div>

      <div v-else class="grid gap-4">
        <LeaguesCardItem
          v-for="league in leagues"
          :key="league.id"
          :league="league"
          :is-owner="league.ownerId === loggedUserId"
        />
      </div>
    </div>
  </div>
</template>
