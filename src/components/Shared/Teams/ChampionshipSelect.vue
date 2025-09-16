<script setup lang="ts">
import services from '@/services'
import { type iChampionship, type iState } from '@/types'
import { onMounted, reactive } from 'vue'
import BaseSearchableSelect from '@/components/Shared/BaseSearchableSelect.vue'

defineProps<{ label: string; required?: boolean; disabled?: boolean }>()

const championshipId = defineModel<number | null>({ required: true })

const state = reactive<iState<iChampionship[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadChampionships = async () => {
  try {
    state.loading = true

    state.data = await services.championships.fetchChampionships()
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
    id="championship-select"
    v-model="championshipId"
    :options="state.data"
    :label="label"
    placeholder="Selecione o campeonato"
    :required="required"
    :disabled="disabled || state.loading"
    selection="object"
  >
    <template #option="{ option }">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span :class="{ 'text-primary': option.id === championshipId }">{{ option.name }}</span>
        </div>
        <i v-if="option.id === championshipId" class="fa-solid fa-check text-primary" />
      </div>
    </template>
  </BaseSearchableSelect>
</template>
