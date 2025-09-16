<script setup lang="ts">
import services from '@/services'
import { type iChampionshipGroup, type iState } from '@/types'
import { onMounted, reactive } from 'vue'
import BaseSearchableSelect from '@/components/Shared/BaseSearchableSelect.vue'

const props = defineProps<{
  championshipId: number
  label: string
  required?: boolean
  disabled?: boolean
  groups?: iChampionshipGroup[]
}>()

const groupId = defineModel<number | null>({ required: true })

const state = reactive<iState<iChampionshipGroup[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadChampionshipGroups = async () => {
  if (props.groups) {
    state.data = props.groups

    return
  }

  try {
    state.loading = true

    state.data = await services.championships.fetchGroups(props.championshipId)
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

onMounted(loadChampionshipGroups)
</script>

<template>
  <BaseSearchableSelect
    id="championship-group-select"
    v-model="groupId"
    :options="state.data"
    :label="label"
    placeholder="Selecione um grupo"
    :required="required"
    :disabled="disabled || state.loading"
    selection="object"
  >
    <template #option="{ option }">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span :class="{ 'text-primary': option.id === groupId }">{{ option.name }}</span>
        </div>
        <i v-if="option.id === groupId" class="fa-solid fa-check text-primary" />
      </div>
    </template>
  </BaseSearchableSelect>
</template>
