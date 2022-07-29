<template>
  <span class="flex align-items-center">
    <span :class="status.icon" :style="status.iconStyle" class="mr-2" />
    {{ $t(status.text) }}
  </span>
</template>

<script setup>
import { STATUSES_LABELS } from '@/constants'
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
    default: () => STATUSES_LABELS
  }
})

const status = computed(() => props.options[props.status])
</script>
