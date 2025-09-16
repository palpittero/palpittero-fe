<script setup lang="ts">
import type { iTeam } from '@/types'

import { computed } from 'vue'
import TeamsModalSelect from '../Teams/TeamsModalSelect.vue'
import TeamsChips from '../Teams/TeamsChips.vue'

const props = defineProps<{
  required?: boolean
}>()

const teams = defineModel<iTeam[]>({ required: true })

const handleRemove = (team: iTeam) => {
  teams.value = teams.value.filter((t) => t.id !== team.id)
}

const handleClear = () => {
  teams.value = []
}

const handleAdd = () => {
  // @ts-ignore
  championship_teams_modal_select.showModal()
}

const handleConfirm = (selectedTeams: iTeam[]) => {
  teams.value = [...selectedTeams]

  // @ts-ignore
  championship_teams_modal_select.close()
}

const hasTeams = computed(() => teams.value.length > 0)

const isInvalid = computed<boolean>(() => props.required && !hasTeams.value)
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend flex items-center justify-between w-full">
      Times
      <div class="flex">
        <a class="link link-hover link-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" /> Selecionar Times
        </a>
        <template v-if="hasTeams">
          <div class="divider divider-horizontal mx-0" />
          <a class="link link-hover link-primary" @click="handleClear">
            <i class="fa-solid fa-trash" /> Limpar
          </a>
        </template>
      </div>
    </legend>
    <div class="flex flex-col">
      <TeamsChips v-if="hasTeams" :teams="teams" @remove="handleRemove" />
      <div class="alert alert-warning alert-soft" v-else>
        <span> <i class="fa-solid fa-warning" /> Nenhum time selecionado </span>
      </div>

      <input
        type="number"
        class="input validator hidden"
        :value="teams.length"
        :required="required"
        :min="1"
      />
      <div class="validator-hint" v-if="isInvalid">Selecione pelo menos um time</div>
    </div>

    <TeamsModalSelect
      id="championship_teams_modal_select"
      :selected-teams="teams"
      @confirm="handleConfirm"
    />
  </fieldset>
</template>
