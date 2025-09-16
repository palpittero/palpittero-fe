<script setup lang="ts">
import type { iTeam } from '@/types'

defineProps<{
  teams: iTeam[]
}>()

const emit = defineEmits<{
  remove: [team: iTeam]
}>()

const handleRemove = (team: iTeam) => {
  emit('remove', team)
}
</script>

<template>
  <div class="flex gap-2 flex-wrap">
    <div v-for="team of teams" :key="team.id" class="badge badge-primary cursor-pointer">
      <img class="size-4 rounded-box object-cover" :src="team.badge!" />
      {{ team.name }}
      <span class="fa-solid fa-xmark hover:opacity-80" @click="handleRemove(team)" />
    </div>
  </div>
</template>
