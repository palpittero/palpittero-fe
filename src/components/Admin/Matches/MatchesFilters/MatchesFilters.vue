<template>
  <pre>{{ championship }}</pre>
  <div class="flex p-toolbar justify-content-start gap-3 mb-3">
    <div class="field">
      <label for="championship-id">
        {{ $t('admin.matches.championship') }}
      </label>
      <ChampionshipSelect
        id="championship-id"
        v-model="championship"
        clearable
        :extra-fields="['hasGroups']"
        @update:model-value="handleChampionshipUpdate"
      />
    </div>
    <template v-if="championship?.id">
      <div class="field" v-if="championship?.hasGroups">
        <label for="championship-id">
          {{ $t('admin.matches.group') }}
        </label>
        <GroupSelect
          v-model="group"
          :championship-id="championship.id"
          clearable
          @update:model-value="handleGroupUpdate"
        />
      </div>
      <div class="field">
        <label for="championship-id">
          {{ $t('admin.matches.round') }}
        </label>
        <RoundSelect
          v-model="round"
          clearable
          :championship-id="championship.id"
          @update:model-value="handleRoundUpdate"
        /></div
    ></template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import ChampionshipSelect from '@/components/Admin/Championships/ChampionshipSelect/ChampionshipSelect.vue'
import GroupSelect from '@/components/Shared/Championships/GroupSelect/GroupSelect.vue'
import RoundSelect from '@/components/Admin/Rounds/RoundSelect/RoundSelect.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['update:modelValue'])
const championship = ref(null)
const group = ref(null)
const round = ref(null)

const filters = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleChampionshipUpdate = (championship) =>
  (filters.value.championshipId = championship?.id)

const handleGroupUpdate = (group) => (filters.value.groupId = group?.id)

const handleRoundUpdate = (round) => (filters.value.roundId = round?.id)
</script>
