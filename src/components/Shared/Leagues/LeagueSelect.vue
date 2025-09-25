<script setup lang="ts">
import services from '@/services'
import { type iLeague, type iState } from '@/types'
import { computed, onMounted, reactive, watch } from 'vue'
import BaseSearchableSelect from '@/components/Shared/BaseSearchableSelect.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'

const props = withDefaults(
  defineProps<{
    id?: string
    label: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    leagues?: iLeague[]
    filter?: (leagues: iLeague[]) => iLeague[]
  }>(),
  {
    id: 'league-select',
    leagues: () => [],
  },
)

const leagueId = defineModel<string | number | iLeague | null>()

const state = reactive<iState<iLeague[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadLeagues = async () => {
  if (props.leagues.length > 0) {
    state.data = props.leagues
    return
  }

  try {
    state.loading = true

    state.data = await services.leagues.fetchLeagues()
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

const filteredLeagues = computed<iLeague[]>(() => {
  if (props.filter) {
    return props.filter(state.data)
  }

  return state.data
})

watch(
  () => props.leagues,
  (current) => {
    state.data = current as iLeague[]
  },
  { immediate: true },
)

onMounted(loadLeagues)
</script>

<template>
  <BaseSearchableSelect
    :id="id"
    v-model="leagueId"
    :options="filteredLeagues"
    :label="label"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled || state.loading"
    clearable
  >
    <template #option="{ option }">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BaseImage :src="option.badge" class="size-5 rounded-md" />
          <span :class="{ 'text-primary': option.id === leagueId }">{{ option.name }}</span>
        </div>
        <i v-if="option.id === leagueId" class="fa-solid fa-check text-primary" />
      </div>
    </template>
  </BaseSearchableSelect>
</template>
