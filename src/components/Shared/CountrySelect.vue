<script setup lang="ts">
import services from '@/services'
import { type iCountry, type iState } from '@/types'
import { onMounted, reactive } from 'vue'
import BaseSearchableSelect from './BaseSearchableSelect.vue'
import BaseImage from './BaseImage.vue'

defineProps<{ label: string; required?: boolean; disabled?: boolean }>()

const countryId = defineModel<string | number | null>()

const state = reactive<iState<iCountry[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadCountries = async () => {
  try {
    state.loading = true

    state.data = await services.teams.fetchCountries()
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

onMounted(loadCountries)
</script>

<template>
  <BaseSearchableSelect
    id="country-select"
    v-model="countryId"
    :options="state.data"
    :label="label"
    placeholder="Selecione o país"
    :required="required"
    :disabled="disabled || state.loading"
  >
    <template #option="{ option }">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BaseImage :src="option.flag" class="size-5" />
          <span :class="{ 'text-primary': option.id === countryId }">{{ option.name }}</span>
        </div>
        <i v-if="option.id === countryId" class="fa-solid fa-check text-primary" />
      </div>
    </template>
  </BaseSearchableSelect>
</template>
