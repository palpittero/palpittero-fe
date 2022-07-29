<template>
  <Dropdown
    v-model="championship"
    :options="parsedChampionships"
    optionLabel="name"
    :optionValue="getOptionValue"
    filter
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
import services from '@/services'
import { computed, reactive, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  filter: {
    type: Function,
    default: (championships) => championships
  },
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

const parsedChampionships = computed(() =>
  championships.data.map(({ id, name, year }) => ({ id, name, year }))
)

const getOptionValue = ({ id, name, year }) => ({ id, name, year })
</script>
