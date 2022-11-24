<template>
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
        @click="goToUserChampionshipGuessesRoute"
        :label="$t('app.guesses.viewOtherGuesses')"
        class="p-button-link p-button-clear p-button-sm p-0"
        icon="pi pi-search"
      />
    </div>

    <!-- <router-link
      :to="{
        name: 'UserChampionshipGuesses',
        params: { leagueId, championshipId }
      }"
    >
      <div class="flex align-items-center gap-2">
        <span class="pi pi-search" />
        {{ $t('app.guesses.viewOtherGuesses') }}
      </div>
    </router-link> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import TeamSelect from '@/components/Admin/Teams/TeamSelect/TeamSelect.vue'

const i18n = useI18n()
const router = useRouter()

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

const goToUserChampionshipGuessesRoute = () => {
  router.push({
    name: 'UserChampionshipGuesses',
    params: {
      leagueId: props.leagueId,
      championshipId: props.championshipId
    }
  })
}
</script>
