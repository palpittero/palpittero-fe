<template>
  <AutoComplete
    v-model="selectedTeams"
    :suggestions="filteredTeams"
    @complete="handleComplete"
    option-label="name"
    multiple
    data-key="id"
  >
    <template #item="{ item }">
      {{ item.name }}
    </template>
    <template #chip="{ value }">
      {{ value.name }}
    </template>
  </AutoComplete>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'email'
  },
  teams: {
    type: Array,
    default: () => []
  },
  onFilter: {
    type: Function,
    default: () => true
  }
})

const emits = defineEmits(['update:modelValue', 'notAllowed'])

const query = ref('')

const selectedTeams = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleComplete = (event) => (query.value = event.query.trim())

const filteredTeams = computed(() =>
  query.value.length
    ? props.teams
        .filter(props.onFilter)
        .filter((team) =>
          team.name.toLowerCase().startsWith(query.value.toLowerCase())
        )
    : props.teams.filter(props.onFilter)
)
</script>
