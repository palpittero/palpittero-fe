<script setup lang="ts">
import type { iChampionshipGroup, iTeam } from '@/types'
import TeamsChips from '@/components/Admin/Teams/TeamsChips.vue'
import { computed } from 'vue'

defineProps<{
  index: number
}>()

const emit = defineEmits<{
  'select-teams': [group: iChampionshipGroup]
  remove: [group: iChampionshipGroup]
}>()

const group = defineModel<iChampionshipGroup>({ required: true })

const hasTeams = computed<boolean>(() => group.value.teams.length > 0)

const handleSelectTeams = (group: iChampionshipGroup) => {
  emit('select-teams', group)
}

const handleRemove = (group: iChampionshipGroup) => {
  emit('remove', group)
}

const handleRemoveTeam = ({ group, team }: { group: iChampionshipGroup; team: iTeam }) => {
  group.teams = group.teams.filter((t) => t.id !== team.id)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col">
      <fieldset class="fieldset flex items-center">
        <legend class="fieldset-legend">Nome</legend>
        <label class="input focus-within:outline-none">
          <input
            type="text"
            placeholder="Informe o nome do grupo"
            v-model="group.name"
            class="validator"
          />
          <a class="link link-hover link-primary" @click="handleSelectTeams(group)">
            <i class="fa-solid fa-plus" /> Selecionar Times
          </a>
        </label>
        <button class="btn btn-ghost" @click="handleRemove(group)" :disabled="index === 0">
          <i class="fa-solid fa-trash" :class="{ 'text-error': index !== 0 }" />
        </button>
      </fieldset>
    </div>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Times</legend>
      <TeamsChips
        v-if="hasTeams"
        :teams="group.teams"
        @remove="(team: iTeam) => handleRemoveTeam({ group, team })"
      />
      <div class="alert alert-warning alert-soft" v-else>
        <span> <i class="fa-solid fa-warning" /> Nenhum time selecionado </span>
      </div>
      <input type="number" class="hidden validator" required min="1" :value="group.teams.length" />
      <div class="validator-hint">Adicione pelo menos um time neste grupo</div>
    </fieldset>

    <div class="divider my-0" />
  </div>
</template>
