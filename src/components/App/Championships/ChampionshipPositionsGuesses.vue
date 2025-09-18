<script setup lang="ts">
import TeamSelect from '@/components/Admin/Teams/TeamSelect.vue'
import type { iChampionshipGuess } from '@/types'

const props = defineProps<{
  championshipId: number
  leagueId: number
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'view-other-championship-guesses': [championshipId: number]
}>()

const championshipGuesses = defineModel<Record<number, iChampionshipGuess>>({ required: true })

const onFilterTeams = (guess: iChampionshipGuess) => (teams: any[]) => {
  const teamsIds = Object.values(championshipGuesses.value)
    .filter(({ teamId }) => teamId && guess.teamId !== teamId)
    .map(({ teamId }) => teamId)

  return teams.filter((team) => !teamsIds.includes(team.id))
}

const positionsTitles: Record<number, string> = {
  1: 'Campeão',
  2: 'Vice-campeão',
}

const handleViewOtherChampionshipGuesses = () => {
  emit('view-other-championship-guesses', props.championshipId)
}
</script>

<template>
  <div class="mb-4 py-4">
    <div
      class="flex flex-col justify-between bg-primary/5 p-4 rounded-box border border-primary/20"
    >
      <div class="flex-1 gap-4">
        <div class="animate-pulse space-y-4" v-if="loading">
          <div class="h-4 bg-base-300 rounded w-1/2" />
          <div class="h-10 bg-base-300 rounded" />
        </div>
        <div v-else class="flex gap-4">
          <TeamSelect
            v-for="(guess, index) in championshipGuesses"
            :key="index"
            :id="`position_${guess.position}`"
            v-model="championshipGuesses[index].teamId"
            :label="positionsTitles[guess.position]"
            class="w-full"
            :disabled="disabled"
            :championship-id="championshipId"
            :filter="onFilterTeams(guess)"
          />
        </div>
      </div>
      <div class="text-right">
        <button
          @click="handleViewOtherChampionshipGuesses"
          class="link link-hover link-primary"
          type="button"
        >
          <i class="fa-solid fa-search" />
          Ver todos os palpites
        </button>
      </div>
    </div>
  </div>
</template>
