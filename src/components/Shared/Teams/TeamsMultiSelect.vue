<script setup lang="ts">
import TeamsModalSelect from '@/components/Admin/Teams/TeamsModalSelect.vue'
import type { iTeam } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  id: string
  required?: boolean
}>()

const selectedTeams = defineModel<iTeam[]>({ required: true })

const noTeamSelected = computed(() => selectedTeams.value?.length === 0)

const handleAdd = () => {
  // @ts-ignore
  document.getElementById(`${props.id}_modal`)?.showModal()
}

const handleRemove = (championship: iTeam) => {
  selectedTeams.value = selectedTeams.value.filter(({ id }) => id !== championship.id)
}

const handleConfirm = (teams: iTeam[]) => {
  selectedTeams.value = teams
  // @ts-ignore
  document.getElementById(`${props.id}_modal`)?.close()
}

const isInvalid = computed<boolean>(() => props.required && selectedTeams.value.length === 0)
</script>

<template>
  <div>
    <fieldset class="fieldset">
      <legend class="fieldset-legend flex items-center justify-between w-full">
        Times
        <a class="link link-hover link-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" /> Selecionar Times
        </a>
      </legend>
      <div v-if="noTeamSelected" role="alert" class="alert alert-warning alert-soft">
        <span><i class="fa-solid fa-warning" /> Nenhum time selecionado</span>
      </div>
      <ul
        v-else
        class="list bg-base-100 rounded-box shadow-md validator max-h-[200px] overflow-y-auto"
      >
        <li
          class="list-row w-full flex gap-2 items-center justify-between"
          v-for="team in selectedTeams"
          :key="team.id"
        >
          <div class="flex items-center gap-2">
            <img class="size-10 rounded-box object-cover" :src="team.badge!" />
            <div class="flex flex-col">
              <span>
                {{ team.name }}<span v-if="team.region"> / {{ team.region }}</span>
              </span>
              <div class="flex items-center text-xs gap-1 uppercase font-semibold text-gray-400">
                <span
                  v-if="team.country"
                  class="text-xs uppercase font-semibold flex items-center gap-2"
                >
                  <img class="size-3 rounded-box object-cover" :src="team.country?.flag!" />
                  {{ team.country.name }}
                </span>
              </div>
              <span v-if="team.nationalDivision" class="text-xs font-semibold text-gray-400">
                Divisão nacional: {{ team.nationalDivision }}
              </span>
            </div>
          </div>
          <a class="link link-hover link-error" @click="handleRemove(team)">
            <i class="fa-solid fa-trash" />
          </a>
        </li>
      </ul>
      <input
        type="number"
        class="input validator hidden"
        :value="selectedTeams.length"
        :required="required"
        :min="1"
      />
      <div class="validator-hint" v-if="isInvalid">Selecione pelo menos um time</div>
    </fieldset>
    <TeamsModalSelect
      :id="`${id}_modal`"
      :selected-teams="selectedTeams"
      @confirm="handleConfirm"
    />
  </div>
</template>
