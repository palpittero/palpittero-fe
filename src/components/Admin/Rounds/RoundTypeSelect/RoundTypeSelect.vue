<template>
  <Dropdown
    v-model="selectedRoundType"
    :options="CHAMPIONSHIPS_ROUND_TYPE_OPTIONS"
    option-label="name"
    option-value="id"
    :placeholder="$t('admin.championships.type')"
    :disabled="disabled"
    :class="{ 'p-invalid': invalid }"
  >
    <template #value="{ value }">
      {{ $t(`admin.championships.${value}`) }}
    </template>
    <template #option="{ option }">
      {{ $t(option.name) }}
    </template>
  </Dropdown>
</template>

<script setup>
import { computed } from 'vue'

import { CHAMPIONSHIPS_ROUND_TYPE_OPTIONS } from '@/constants/championships'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  disabled: Boolean,
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])

const selectedRoundType = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})
</script>
