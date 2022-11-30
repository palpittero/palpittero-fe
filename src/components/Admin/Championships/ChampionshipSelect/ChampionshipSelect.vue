<template>
  <Dropdown
    v-model="championship"
    :options="parsedChampionships"
    optionLabel="name"
    :optionValue="getOptionValue"
    filter
    :show-clear="clearable"
    :placeholder="$t('admin.championships.selectChampionship')"
    :class="{ 'p-invalid': invalid }"
  >
    <template #value="{ value, placeholder }">
      <div v-if="value" class="flex align-items-center gap-3">
        <div>{{ value.name }} {{ value.year }}</div>
      </div>
      <span v-else>
        {{ placeholder }}
      </span>
    </template>
    <template #option="{ option }">
      <div class="flex align-items-center gap-3">
        <div>{{ option.name }} {{ option.year }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup>
import { pick } from 'lodash/fp'
import { computed, reactive, onMounted } from 'vue'

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
  extraFields: {
    type: Array,
    default: () => []
  },
  clearable: Boolean,
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])
const championships = reactive({
  loading: false,
  error: null,
  data: []
})

const championship = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(async () => {
  const rows = await services.championships.fetchChampionships()
  championships.data = props.filter(rows)
})

const getOptionValue = (championship) =>
  pick(['id', 'name', 'year', ...props.extraFields], championship)

const parsedChampionships = computed(() =>
  championships.data.map(getOptionValue)
)
</script>
