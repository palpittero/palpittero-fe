<template>
  <Dropdown
    v-model="round"
    :options="parsedRounds"
    option-label="name"
    :option-value="getOptionValue"
    :show-clear="clearable"
    filter
    :placeholder="$t('admin.rounds.selectRound')"
    :class="{ 'p-invalid': invalid }"
    :disabled="disabled"
  />
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { pick } from 'lodash/fp'

import services from '@/services'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  filter: {
    type: Function,
    default: (championships) => championships
  },
  championshipId: {
    type: Number,
    required: true
  },
  extraFields: {
    type: Array,
    default: () => []
  },
  clearable: Boolean,
  invalid: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['update:modelValue'])
const rounds = reactive({
  loading: false,
  error: null,
  data: []
})

const round = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

watch(
  () => props.championshipId,
  async () => {
    const rows = await services.championships.fetchRounds(props.championshipId)
    rounds.data = props.filter(rows)
  },
  { immediate: true, deep: true }
)

const getOptionValue = (match) =>
  pick(['id', 'name', ...props.extraFields], match)
const parsedRounds = computed(() => rounds.data.map(getOptionValue))
</script>
