<script setup lang="ts">
import services from '@/services'
import { type iTeam, type iState } from '@/types'
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
    teams?: iTeam[]
    filter?: (teams: iTeam[]) => iTeam[]
  }>(),
  {
    id: 'team-select',
    teams: () => [],
  },
)

const teamId = defineModel<string | number | iTeam | null>()

const state = reactive<iState<iTeam[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadTeams = async () => {
  if (props.teams.length > 0) {
    state.data = props.teams
    return
  }

  try {
    state.loading = true

    state.data = await services.teams.fetchTeams()
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

const filteredTeams = computed<iTeam[]>(() => {
  console.log('filteredTeams', state.data, props.filter)
  if (props.filter) {
    console.log('filter', props.filter(state.data))
    return props.filter(state.data)
  }

  return state.data
})

watch(
  () => props.teams,
  (current) => {
    console.log('current', current)
    state.data = current as iTeam[]
  },
  { immediate: true },
)

onMounted(loadTeams)
</script>

<template>
  <BaseSearchableSelect
    :id="id"
    v-model="teamId"
    :options="filteredTeams"
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
          <span :class="{ 'text-primary': option.id === teamId }">{{ option.name }}</span>
        </div>
        <i v-if="option.id === teamId" class="fa-solid fa-check text-primary" />
      </div>
    </template>
  </BaseSearchableSelect>
</template>
