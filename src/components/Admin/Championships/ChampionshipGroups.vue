<script setup lang="ts">
import { createGroup } from '@/helpers/championships'
import TeamsModalSelect from '../Teams/TeamsModalSelect.vue'
import type { iChampionshipGroup, iTeam } from '@/types'
import { computed, ref, watch } from 'vue'
import ChampionshipGroup from './ChampionshipGroup.vue'

const props = defineProps<{
  teams: iTeam[]
}>()

const groups = defineModel<iChampionshipGroup[]>('groups', { required: true })

const hasNoTeams = computed<boolean>(() => props.teams.length === 0)
const hasGroups = defineModel<boolean>('has-groups', { required: true })

const selectedGroupId = ref<string | number | undefined>()
const selectedTeams = ref<iTeam[]>([])

const handleAddGroup = () => {
  const name = `Grupo ${groups.value.length + 1}`
  groups.value = [...groups.value, createGroup(name)]
}

const handleRemoveGroup = (group: iChampionshipGroup) =>
  (groups.value = groups.value.filter(({ uuid, id }) => id !== group.id || uuid !== group.uuid))

const disabledTeams = computed<number[]>(
  () =>
    groups.value
      .filter((group) => (group.uuid || group.id) !== selectedGroupId.value)
      .reduce(
        (acc: number[], group: iChampionshipGroup) => [
          ...acc,
          ...group.teams.map((team: iTeam) => team.id as number),
        ],
        [],
      ) as number[],
)

const handleSelectTeams = (group: iChampionshipGroup) => {
  selectedGroupId.value = group.uuid || group.id
  selectedTeams.value = group.teams

  // @ts-ignore
  championship_group_teams_modal_select.showModal()
}

const handleConfirmGroupTeams = (teams: iTeam[]) => {
  const groupIndex = groups.value.findIndex(
    (group) => (group.uuid || group.id) === selectedGroupId.value,
  )

  groups.value[groupIndex].teams = [...teams]
  selectedTeams.value = []
  selectedGroupId.value = undefined

  // @ts-ignore
  championship_group_teams_modal_select.close()
}

const filterGroupsTeams = (team: iTeam) => props.teams.some((t) => t.id === team.id)

watch(
  () => props.teams,
  (current, previous) => {
    if (current.length !== previous?.length) {
      for (const group of groups.value) {
        for (const team of group.teams) {
          if (!current.some((t) => t.id === team.id)) {
            group.teams = group.teams.filter((t) => t.id !== team.id)
          }
        }
      }
    }
  },
  {
    deep: true,
  },
)
</script>

<template>
  <fieldset class="fieldset w-auto inline">
    <legend class="fieldset-legend">Grupos</legend>

    <label class="label">
      <input
        v-model="hasGroups"
        type="checkbox"
        class="toggle toggle-primary"
        :disabled="hasNoTeams"
      />
      Definir grupos
      <span
        class="tooltip"
        v-if="hasNoTeams"
        data-tip="Selecione pelo menos um time para definir grupos"
      >
        <i class="fa-solid fa-info-circle text-primary cursor-pointer" />
      </span>
    </label>
  </fieldset>

  <div v-if="hasGroups" class="flex flex-col gap-2">
    <ChampionshipGroup
      v-for="(group, index) of groups"
      :key="group.uuid || group.id"
      :index="index"
      v-model="groups[index]"
      @select-teams="handleSelectTeams"
      @remove="handleRemoveGroup"
    />

    <TeamsModalSelect
      id="championship_group_teams_modal_select"
      :selected-teams="selectedTeams"
      :disabled-teams="disabledTeams"
      :filter="filterGroupsTeams"
      @confirm="handleConfirmGroupTeams"
    />

    <button class="btn btn-primary btn-outline" @click="handleAddGroup" type="button">
      <i class="fa-solid fa-plus" />
      Adicionar Grupo
    </button>
  </div>
</template>
