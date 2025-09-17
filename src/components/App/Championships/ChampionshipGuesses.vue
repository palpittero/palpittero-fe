<template>
  <div class="championship-guesses">
    <div
      class="flex flex-col md:flex-row justify-between bg-purple-50/30 p-4 mt-4 rounded-lg border border-purple-200"
    >
      <div class="grid flex-1 gap-4">
        <template v-if="loading">
          <div class="animate-pulse space-y-4">
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-10 bg-gray-300 rounded"></div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(guess, index) in championshipGuesses"
            :key="index"
            class="flex flex-col space-y-2"
          >
            <label class="text-sm font-semibold text-gray-700" :for="`position_${guess.position}`">
              {{ positionsTitles[guess.position] }}
            </label>
            <TeamSelect
              :id="`position_${guess.position}`"
              v-model="guess.team"
              :label="`position_${guess.position}`"
              class="w-full"
              :disabled="disabled"
              :championship-id="championshipId"
              :filter="onFilterTeams(guess)"
              @update:model-value="(value) => handleTeamUpdate(value, guess)"
            />
          </div>
        </template>
      </div>
      <div class="flex items-start gap-2 mt-4 md:mt-0">
        <button
          @click="openChampionshipGuessesDialog"
          class="btn btn-ghost btn-sm gap-2 text-primary"
          type="button"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Ver outros palpites
        </button>
      </div>
    </div>
  </div>

  <!-- Championship Guesses Dialog -->
  <div v-if="isChampionshipGuessesDialogVisible" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Palpites do Campeonato</h3>
      <p class="py-4">Componente de visualização de outros palpites será implementado aqui.</p>
      <div class="modal-action">
        <button class="btn" @click="handleChampionshipGuessesDialogHide">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TeamSelect from '@/components/Admin/Teams/TeamSelect.vue'

interface ChampionshipGuess {
  position: number
  team: any
  teamId?: number
}

const props = defineProps<{
  modelValue: Record<number, ChampionshipGuess>
  championshipId: number
  leagueId: number
  loading?: boolean
  disabled?: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [value: Record<number, ChampionshipGuess>]
}>()

const isChampionshipGuessesDialogVisible = ref(false)

const championshipGuesses = computed({
  set(value: Record<number, ChampionshipGuess>) {
    emits('update:modelValue', value)
  },
  get(): Record<number, ChampionshipGuess> {
    return props.modelValue
  },
})

const handleTeamUpdate = (team: any, guess: ChampionshipGuess) => {
  if (championshipGuesses.value[guess.position]) {
    championshipGuesses.value[guess.position].teamId = team?.id
    championshipGuesses.value[guess.position].team = team
  }
}

const onFilterTeams = (guess: ChampionshipGuess) => (teams: any[]) => {
  const teamsIds = Object.values(championshipGuesses.value)
    .filter(({ teamId }) => teamId && guess.teamId !== teamId)
    .map(({ teamId }) => teamId)

  return teams.filter((team) => !teamsIds.includes(team.id))
}

const positionsTitles: Record<number, string> = {
  1: 'Campeão',
  2: 'Vice-campeão',
}

const openChampionshipGuessesDialog = () => (isChampionshipGuessesDialogVisible.value = true)

const handleChampionshipGuessesDialogHide = () => (isChampionshipGuessesDialogVisible.value = false)
</script>

<style scoped>
.championship-guesses {
  /* @apply mb-4; */
}
</style>
