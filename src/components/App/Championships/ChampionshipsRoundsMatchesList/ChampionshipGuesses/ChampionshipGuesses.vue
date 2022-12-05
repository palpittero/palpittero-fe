<template>
  <div class="flex flex-column">
    <h5
      class="flex gap-2 text-center md:text-left align-items-center bg-red-100 text-bold p-3 mb-0 mt-3"
    >
      <span class="hidden md:block pi pi-exclamation-triangle" /> Os palpites de
      campeão e vice poderão ser registrados até o final do último jogo da
      rodada de oitavas de final, no dia 06/12 às 18h.
    </h5>

    <div
      class="flex flex-column md:flex-row justify-content-between bg-purple-50 p-3 mt-3"
    >
      <div class="grid flex-1 align-items-center">
        <template v-if="loading">
          <Skeleton />
        </template>
        <template v-else>
          <div
            class="field col-12 md:col-5"
            v-for="(guess, index) in championshipGuesses"
            :key="index"
          >
            <label class="text-bold" :for="`position_${guess.position}`">{{
              positionsTitles[guess.position]
            }}</label>
            <span>
              <TeamSelect
                :id="`position_${guess.position}`"
                v-model="guess.team"
                class="w-full"
                clearable
                :championship-id="championshipId"
                :filter="onFilterTeams(guess)"
                @update:model-value="(value) => handleTeamUpdate(value, guess)"
              />
            </span>
          </div>
        </template>
      </div>
      <div class="flex align-items-start gap-2">
        <Button
          @click="openChampionshipGuessesDialog"
          :label="$t('app.guesses.viewOtherGuesses')"
          class="p-button-link p-button-clear p-button-sm p-0"
          icon="pi pi-search"
        />
      </div>
    </div>
  </div>
  <LeagueChampionshipGuessesDialog
    v-if="isChampionshipGuessesDialogVisible"
    :league-id="leagueId"
    :championship-id="championshipId"
    :visible="isChampionshipGuessesDialogVisible"
    @hide="handleChampionshipGuessesDialogHide"
  />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import TeamSelect from '@/components/Admin/Teams/TeamSelect/TeamSelect.vue'
import LeagueChampionshipGuessesDialog from './LeagueChampionshipGuessesDialog/LeagueChampionshipGuessesDialog.vue'

const i18n = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  championshipId: {
    type: Number,
    required: true
  },
  leagueId: {
    type: Number,
    required: true
  },
  loading: Boolean
})

const emits = defineEmits(['update:modelValue'])

const isChampionshipGuessesDialogVisible = ref(false)

const championshipGuesses = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleTeamUpdate = (team, guess) => {
  championshipGuesses.value[guess.position].teamId = team?.id
}

const onFilterTeams = (guess) => (teams) => {
  const teamsIds = Object.values(championshipGuesses.value)
    .filter(({ teamId }) => teamId && guess.teamId !== teamId)
    .map(({ teamId }) => teamId)

  return teams.filter((team) => !teamsIds.includes(team.id))
}

const positionsTitles = {
  1: i18n.t('app.guesses.champion'),
  2: i18n.t('app.guesses.runnerUp')
}
const openChampionshipGuessesDialog = () =>
  (isChampionshipGuessesDialogVisible.value = true)

const handleChampionshipGuessesDialogHide = () =>
  (isChampionshipGuessesDialogVisible.value = false)
</script>
