<template>
  <Dropdown
    v-model="group"
    :options="groups.data"
    optionLabel="name"
    :optionValue="getOptionValue"
    filter
    :placeholder="$t('admin.championships.group')"
    :class="{ 'p-invalid': invalid }"
  >
    <template #value="{ value, placeholder }">
      <div v-if="value" class="flex align-items-center gap-3">
        <div>{{ value.name }}</div>
      </div>
      <span v-else>
        {{ placeholder }}
      </span>
    </template>
    <template #option="{ option }">
      <div class="flex align-items-center gap-3">
        <div>{{ option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { pick } from 'lodash/fp'

import services from '@/services'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  championshipId: {
    type: Number,
    default: null
  },
  extraFields: {
    type: Array,
    default: () => []
  },
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])
const groups = ref({
  loading: false,
  error: null,
  data: []
})

const group = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(
  async () =>
    (groups.value.data = await services.championships.fetchGroups(
      props.championshipId
    ))
)

const getOptionValue = (group) =>
  pick(['id', 'name', ...props.extraFields], group)
</script>
