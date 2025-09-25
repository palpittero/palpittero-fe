<script setup lang="ts">
import BaseMultiSelect from '@/components/Shared/BaseMultiSelect.vue'
import services from '@/services'
import type { iChampionship, iState } from '@/types'
import { onMounted, reactive } from 'vue'

defineProps<{
  label: string
  required?: boolean
  disabled?: boolean
}>()

const championships = defineModel<iChampionship[]>({ required: true })

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

const handleClear = () => {
  championships.value = championships.value.map((championship) => ({
    ...championship,
    enableGuesses: false,
  }))
}
</script>

<template>
  <fieldset>
    <BaseMultiSelect
      id="championships-multi-select"
      v-model="championships"
      :label="label"
      :options="state.data"
      :disabled="disabled || state.loading"
      @clear="handleClear"
      placeholder="Buscar campeonatos"
      variant="list"
      :required="required"
    >
      <template #selected="{ option, index }">
        <div class="w-full flex items-center justify-between">
          <div>
            <div>
              {{ option.name }}
            </div>
            <div class="text-xs uppercase font-semibold opacity-60">
              {{ option.year }} - {{ option.teams.length }} times
            </div>
          </div>
          <label class="label">
            <input
              type="checkbox"
              class="toggle toggle-primary"
              v-model="championships[index].enableGuesses"
              :true-value="1"
              :false-value="0"
            />
            Habilitar palpite de posições
          </label>
        </div>
      </template>
    </BaseMultiSelect>
    <template v-if="required">
      <input
        type="number"
        class="hidden input validator"
        min="1"
        v-model="championships.length"
        required
      />
      <div class="validator-hint">Selecione pelo menos um campeonato</div>
    </template>
  </fieldset>
</template>
