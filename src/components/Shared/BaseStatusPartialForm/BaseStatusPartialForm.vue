<template>
  <div class="grid">
    <div
      class="field-radiobutton col"
      v-for="option of options"
      :key="option.id"
    >
      <RadioButton
        :id="`status-${option.id}`"
        name="status"
        :value="option.id"
        v-model="status"
      />
      <label :for="`status-${option.id}`">{{ $t(option.name) }}</label>
    </div>
  </div>
</template>

<script setup>
import { STATUSES_OPTIONS } from '@/constants'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => STATUSES_OPTIONS
  }
})

const emits = defineEmits(['update:modelValue'])

const status = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})
</script>
