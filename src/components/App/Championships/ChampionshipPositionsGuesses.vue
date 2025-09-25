<script setup lang="ts">
import TeamSelect from '@/components/Admin/Teams/TeamSelect.vue'
import type { iChampionship, iChampionshipGuess, iTeam } from '@/types'
import MatchGuessPointsBadge from './MatchGuessPointsBadge.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'

const props = defineProps<{
  championship: iChampionship
  teams: iTeam[]
  leagueId: number
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'view-championship-guesses': [championship: iChampionship]
}>()

const championshipGuesses = defineModel<Record<number, iChampionshipGuess>>({ required: true })

const onFilterTeams = ({ guess, teams }: { guess: iChampionshipGuess; teams: iTeam[] }) => {
  const teamsIds = Object.values(championshipGuesses.value)
    .filter(({ teamId }) => teamId && guess.teamId !== teamId)
    .map(({ teamId }) => teamId)

  return teams.filter(
    (team) => props.teams.some((t) => t.id === team.id) && !teamsIds.includes(team.id),
  )
}

const positionsTitles: Record<number, string> = {
  1: 'Campeão',
  2: 'Vice-campeão',
}

const handleViewOtherChampionshipGuesses = () => {
  emit('view-championship-guesses', props.championship)
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
        <div v-else class="flex flex-col lg:flex-row gap-4">
          <div
            v-for="(guess, index) in championshipGuesses"
            :key="index"
            class="flex items-center gap-2 w-full"
          >
            <TeamSelect
              :label="positionsTitles[guess.position]"
              :id="`position_${guess.position}`"
              v-model="championshipGuesses[index].teamId"
              class="w-full"
              :disabled="disabled"
              :championship-id="championship.id"
              :filter="(teams) => onFilterTeams({ guess, teams })"
            >
              <template #label>
                <div class="flex items-center gap-2 justify-between w-full">
                  {{ positionsTitles[guess.position] }} -
                  <div class="flex items-center gap-2">
                    <BaseImage
                      :src="championship.positions?.[index - 1]?.team?.badge"
                      class="size-3.5 rounded-sm"
                    />
                    {{ championship.positions?.[index - 1]?.team?.name }}
                  </div>
                  <MatchGuessPointsBadge
                    class="!text-xs"
                    :guess="{
                      id: guess.id!,
                      points: guess.points!,
                    }"
                  />
                </div>
              </template>
            </TeamSelect>
          </div>
        </div>
      </div>
      <div class="text-right">
        <button
          @click="handleViewOtherChampionshipGuesses"
          class="link link-hover text-xs link-primary"
          type="button"
        >
          <i class="fa-solid fa-search" />
          Ver todos os palpites
        </button>
      </div>
    </div>
  </div>
</template>
