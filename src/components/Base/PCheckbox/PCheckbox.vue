<template>
  <div class="form-check">
    <input
      v-model="value"
      type="checkbox"
      class="form-check-input"
      :class="{ 'is-invalid': validation.isInvalid }"
    />
    <label class="form-check-label"> <slot /> </label>
    <div class="invalid-feedback" v-if="validation.isInvalid">
      {{ validation.message }}
    </div>
  </div>
</template>

<script setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [Boolean, String, Number, Object],
    default: null
  },
  validation: {
    type: Object,
    default: () => ({
      isInvalid: false,
      message: ''
    })
  }
})

const emits = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emits)
</script>
