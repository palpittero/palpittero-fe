<script setup lang="ts">
import services from '@/services'

import type { iChampionshipGroup, iMatch, iMatchRound, iTeam } from '@/types'
import ChampionshipSelect from '@/components/Shared/Teams/ChampionshipSelect.vue'
import ChampionshipRoundSelect from '../Championships/ChampionshipRoundSelect.vue'
import TeamSelect from '../Teams/TeamSelect.vue'
import DataFetcher from '../DataFetcher.vue'
import ChampionshipGroupSelect from '../Championships/ChampionshipGroupSelect.vue'
import { computed, watch } from 'vue'

const match = defineModel<iMatch>({ required: true })

const filterHomeTeams = (teams: iTeam[]) =>
  teams.filter(
    (team) =>
      team.id !== match.value.awayTeamId &&
      match.value.group?.teams.some(({ id }) => id === team.id),
  )

const filterAwayTeams = (teams: iTeam[]) =>
  teams.filter(
    (team) =>
      team.id !== match.value.homeTeamId &&
      match.value.group?.teams.some(({ id }) => id === team.id),
  )

const handleGroupChange = (group: iChampionshipGroup) => {
  match.value.group = group
}

const handleRoundChange = (round: iMatchRound) => {
  match.value.round = round
}

const showGroup = computed<boolean>(() =>
  Boolean(match.value.championship?.hasGroups && !match.value.round?.ignoreGroups),
)

watch(
  () => match.value.groupId,
  () => {
    match.value.homeTeamId = null
    match.value.awayTeamId = null
  },
)
</script>

<template>
  <fieldset class="fieldset">
    <ChampionshipSelect v-model="match.championshipId" label="Campeonato" required disabled />

    <div v-if="match.championshipId">
      <ChampionshipRoundSelect
        v-if="showGroup"
        v-model="match.roundId"
        label="Rodada"
        required
        :championship-id="match.championshipId!"
        @change="handleRoundChange"
      />

      <ChampionshipGroupSelect
        v-model="match.groupId"
        label="Grupo"
        required
        :championship-id="match.championshipId!"
        @change="handleGroupChange"
      />

      <fieldset v-if="match.roundId" class="fieldset" :key="match.groupId!">
        <DataFetcher
          :fetch="services.championships.fetchTeams"
          :params="match.championshipId"
          immediate
        >
          <template #default="{ data, loading }">
            <div class="grid grid-cols-12 w-full gap-4">
              <TeamSelect
                v-model="match.homeTeamId"
                :filter="filterHomeTeams"
                :teams="data"
                label="Time da Casa"
                class="col-span-12 lg:col-span-4"
                placeholder="Selecione o time da casa"
                required
                :disabled="loading"
              />
              <TeamSelect
                v-model="match.awayTeamId"
                :filter="filterAwayTeams"
                :teams="data"
                label="Time Visitante"
                class="col-span-12 lg:col-span-4"
                placeholder="Selecione o time visitante"
                required
                :disabled="loading"
              />
              <fieldset class="fieldset col-span-12 lg:col-span-4">
                <legend class="fieldset-legend">Data/Horário</legend>
                <input
                  type="datetime-local"
                  class="input validator"
                  v-model="match.date"
                  required
                />
                <div class="validator-hint">A data/horário é obrigatória</div>
              </fieldset>
            </div>
          </template>
        </DataFetcher>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Status</legend>
          <label class="label">
            <input
              v-model="match.resetStatus"
              type="checkbox"
              class="toggle toggle-primary"
              :true-value="1"
              :false-value="0"
            />
            Redefinir Status
            <span
              class="tooltip tooltip-right"
              data-tip="Ao redefinir o status da partida o mesmo passará a ser calculado automaticamente comparando a data/hora atuais com a data/hora da partida"
            >
              <i class="fa-solid fa-question-circle" />
            </span>
          </label>
        </fieldset>
      </fieldset>
    </div>
  </fieldset>
</template>
