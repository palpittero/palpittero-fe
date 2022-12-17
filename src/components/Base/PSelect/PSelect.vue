<template>
  <VueMultiSelect v-model="value" :options="options" />
</template>

<script setup>
import VueMultiSelect from 'vue-multiselect'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Object, String, Number],
    default: null
  }
})

const emits = defineEmits(['update:modelValue'])

const value = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})
</script>
