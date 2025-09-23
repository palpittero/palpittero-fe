<script setup lang="ts">
import type { iChampionship, iChampionshipGroup, iMatchDetail, iState, iTeam } from '@/types'
import ChampionshipGroupSelect from '../Championships/ChampionshipGroupSelect.vue'
import BaseModal from '@/components/Shared/BaseModal.vue'
import services from '@/services'
import TeamSelect from '../Teams/TeamSelect.vue'
import { reactive } from 'vue'

const props = defineProps<{
  championship: iChampionship
}>()

const emit = defineEmits<{
  confirm: [matchDetail: iMatchDetail]
}>()

const matchDetail = defineModel<iMatchDetail>({ required: true })

const handleSubmit = () => {
  emit('confirm', matchDetail.value)
}

const filterHomeTeams = (teams: iTeam[]): iTeam[] =>
  teams.filter(
    (team) =>
      team.id !== matchDetail.value.awayTeamId &&
      (!props.championship.hasGroups ||
        (props.championship.hasGroups &&
          matchDetail.value.group?.teams.some(({ id }) => id === team.id))),
  )

const filterAwayTeams = ({ teams, matchDetail }: { teams: iTeam[]; matchDetail: iMatchDetail }) =>
  teams.filter(
    (team) =>
      team.id !== matchDetail.homeTeamId &&
      (!props.championship.hasGroups ||
        (props.championship.hasGroups &&
          matchDetail.group?.teams.some(({ id }) => id === team.id))),
  )

const teams = reactive<iState<iTeam[]>>({
  loading: false,
  data: [],
  error: null,
})

const handleOpen = async () => {
  teams.loading = true
  teams.data = await services.championships.fetchTeams(props.championship.id)
  teams.loading = false
}

const handleGroupChange = (group: iChampionshipGroup) => {
  matchDetail.value.group = group
  matchDetail.value.homeTeamId = null
  matchDetail.value.awayTeamId = null
}

const handleHomeTeamChange = (team: iTeam) => {
  matchDetail.value.homeTeam = team
}

const handleAwayTeamChange = (team: iTeam) => {
  matchDetail.value.awayTeam = team
}
</script>

<template>
  <BaseModal
    id="match_detail_modal_form"
    title="Partida"
    size="md"
    @submit="handleSubmit"
    @open="handleOpen"
  >
    <ChampionshipGroupSelect
      v-if="championship?.hasGroups"
      v-model="matchDetail.groupId"
      label="Grupo"
      required
      :championship-id="championship.id"
      @change="handleGroupChange"
    />

    <div
      class="flex w-full gap-4"
      v-if="!championship?.hasGroups || (championship?.hasGroups && matchDetail.group)"
      :key="matchDetail.groupId"
    >
      <div class="grid grid-cols-12 w-full gap-4">
        <TeamSelect
          id="home-team-select"
          v-model="matchDetail.homeTeamId"
          :filter="filterHomeTeams"
          :teams="teams.data"
          label="Time da Casa"
          class="col-span-12 lg:col-span-4"
          placeholder="Selecione o time da casa"
          required
          :disabled="teams.loading"
          @change="handleHomeTeamChange"
        />
        <TeamSelect
          id="away-team-select"
          v-model="matchDetail.awayTeamId"
          :filter="(teams: iTeam[]) => filterAwayTeams({ teams, matchDetail })"
          :teams="teams.data"
          label="Time Visitante"
          class="col-span-12 lg:col-span-4"
          placeholder="Selecione o time visitante"
          required
          :disabled="teams.loading"
          @change="handleAwayTeamChange"
        />
        <fieldset class="fieldset col-span-12 lg:col-span-4">
          <legend class="fieldset-legend">Data/Horário</legend>
          <input
            type="datetime-local"
            class="input validator"
            v-model="matchDetail.date"
            required
          />
          <div class="validator-hint">A data/horário é obrigatória</div>
        </fieldset>
      </div>
    </div>
  </BaseModal>
</template>
