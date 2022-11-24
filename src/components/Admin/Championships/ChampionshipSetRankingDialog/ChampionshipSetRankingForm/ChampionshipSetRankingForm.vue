<template>
  <div
    class="field"
    v-for="(position, index) in championship.positions"
    :key="index"
  >
    <label class="text-bold" :for="`position_${position.position}`">{{
      positionLabels[position.position].label
    }}</label>
    <TeamSelect
      :id="`position_${position.position}`"
      v-model="championship.positions[position.position].team"
      :championship-id="championship.id"
      :filter="getOnFilterTeams(position)"
      clearable
      @update:model-value="
        (team) => handleChampionshipPositionUpdate(team, position.position)
      "
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

import TeamSelect from '@/components/Admin/Teams/TeamSelect/TeamSelect.vue'

const i18n = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue'])

const championship = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const positionLabels = {
  1: {
    label: i18n.t('admin.championships.champion')
  },
  2: {
    label: i18n.t('admin.championships.runnerUp')
  }
}

const handleChampionshipPositionUpdate = (team, position) =>
  (championship.value.positions[position].teamId = team?.id ?? null)

const getOnFilterTeams = (position) => (teams) => {
  const teamsIds = Object.values(championship.value.positions)
    .filter((it) => it.position !== position.position && it.teamId)
    .map(({ teamId }) => teamId)

  return teams.filter(({ id }) => !teamsIds.includes(id))
}
</script>
