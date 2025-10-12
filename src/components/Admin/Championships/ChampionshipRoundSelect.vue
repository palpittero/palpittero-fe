<script setup lang="ts">
import services from '@/services'
import { type iOption, type iState } from '@/types'
import { onMounted, reactive } from 'vue'
import BaseSearchableSelect from '@/components/Shared/BaseSearchableSelect.vue'
import { parseOptions } from '@/helpers/utils'

const props = defineProps<{
  championshipId: number
  label: string
  required?: boolean
  disabled?: boolean
}>()

const roundId = defineModel<string | number | null>()

const state = reactive<iState<iOption[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadChampionships = async () => {
  try {
    state.loading = true

    state.data = parseOptions(await services.championships.fetchRounds(props.championshipId), [
      'ignoreGroups',
    ])
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

onMounted(loadChampionships)
</script>

<template>
  <BaseSearchableSelect
    id="championship-round-select"
    v-model="roundId"
    :options="state.data"
    :label="label"
    placeholder="Selecione a rodada"
    :required="required"
    :disabled="disabled || state.loading"
  >
    <template #option="{ option }">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span :class="{ 'text-primary': option.id === roundId }">{{ option.name }}</span>
        </div>
        <i v-if="option.id === roundId" class="fa-solid fa-check text-primary" />
      </div>
    </template>
  </BaseSearchableSelect>
</template>
